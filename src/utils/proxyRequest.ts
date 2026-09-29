import http from 'http'
import https from 'https'
import { TProxyResponse } from '../types/services'
import { EHttpMethods } from '../config/enums'
import { proxyRequestConfig } from '../config/proxy'
import { httpStatus } from './HttpStatus'

/**
 * 全局共享的连接复用 Agent
 */
const httpUserAgent: http.Agent = new http.Agent({
	keepAlive: true,
	maxSockets: proxyRequestConfig.maxSockets,
	maxFreeSockets: proxyRequestConfig.maxFreeSockets,
})
const httpsUserAgent: https.Agent = new https.Agent({
	keepAlive: true,
	maxSockets: proxyRequestConfig.maxSockets,
	maxFreeSockets: proxyRequestConfig.maxFreeSockets,
})

export interface ProxyRequestOptions {
	method?: EHttpMethods
	headers?: Record<string, any>
	body?: any
	/**
	 * 覆盖默认超时 (ms)
	 */
	timeout?: number
	/**
	 * 剩余可跟随的重定向次数(内部递归使用)
	 */
	maxRedirects?: number
	/**
	 * host 白名单校验钩子
	 * 		- 对初始 URL 及每一次重定向目标都会调用
	 * 		- 返回 false 表示该目标不被允许, 请求将被拒绝, 用于防御重定向导致的 SSRF 绕过
	 */
	isUrlAllowed?: (url: string) => boolean
	/**
	 * 流式模式
	 * 		- 收到响应头后立即 resolve, body 为原始可读流 (res), 不在内存中缓冲整个响应体
	 * 		- 适用于大文件/静态资源转发
	 */
	stream?: boolean
}

/**
 * 校验协议是否被允许 (仅 http / https)
 */
function assertProtocol(url: string): void {
	let parsed: URL
	try {
		parsed = new URL(url)
	} catch {
		throw new Error(`invalid proxy url: ${url}`)
	}
	if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
		throw new Error(`protocol not allowed: ${parsed.protocol}`)
	}
}

/**
 * 发起一次 HTTP/HTTPS 请求, 并将响应封装为统一的 TProxyResponse
 *
 * 		输入:
 * 			- url: 目标完整 URL (含协议)
 * 			- optional: 请求选项
 */
export async function proxyRequest(url: string, optional: ProxyRequestOptions = {}): Promise<TProxyResponse> {
	assertProtocol(url)
	/**
	 * 初始 URL 的白名单校验; 重定向目标会在收到 Location 后再次校验
	 */
	if (optional.isUrlAllowed && !optional.isUrlAllowed(url)) {
		throw {
			url,
			res: null,
			err: new Error('proxy target not allowed'),
			status: httpStatus.Forbidden.status,
			statusText: httpStatus.Forbidden.message(),
		}
	}
	const timeout: number = optional.timeout ?? proxyRequestConfig.timeout
	const maxRedirects: number = optional.maxRedirects ?? proxyRequestConfig.maxRedirects
	const maxContentLength: number = proxyRequestConfig.maxContentLength
	return new Promise<TProxyResponse>((resolve, reject): void => {
		const isHttps: boolean = url.startsWith('https')
		const client: typeof http | typeof https = isHttps ? https : http
		const userAgent: http.Agent = isHttps ? httpsUserAgent : httpUserAgent
		const method: string = (optional.method || 'get').toUpperCase()
		const requestOption: http.RequestOptions = {
			method,
			headers: optional.headers || {},
			agent: userAgent,
			timeout,
		}
		const req: http.ClientRequest = client.request(url, requestOption, (res: http.IncomingMessage): void => {
			const status: number = res.statusCode || 0
			if (status >= httpStatus.MultipleChoices.status && status < httpStatus.BadRequest.status && res.headers.location) {
				res.resume()
				if (maxRedirects <= 0) {
					reject({
						url,
						res: null,
						err: new Error('too many redirects'),
						status: httpStatus.LoopDetected.status,
						statusText: httpStatus.LoopDetected.message(),
					})
					return
				}
				const nextUrl: string = new URL(res.headers.location, url).toString()
				/**
				 * 重定向目标必须再次通过白名单校验, 防止 302 跳转到白名单外主机造成 SSRF 绕过
				 */
				if (optional.isUrlAllowed && !optional.isUrlAllowed(nextUrl)) {
					reject({
						url: nextUrl,
						res: null,
						err: new Error('redirect target not allowed'),
						status: httpStatus.Forbidden.status,
						statusText: httpStatus.Forbidden.message(),
					})
					return
				}
				proxyRequest(nextUrl, { ...optional, maxRedirects: maxRedirects - 1 })
					.then(resolve)
					.catch(reject)
				return
			}
			/**
			 * 流式模式: 不缓冲响应体, 收到响应头即以原始可读流形式返回, 由上层直接 pipe
			 */
			if (optional.stream) {
				resolve({
					content: '',
					body: res,
					isStream: true,
					status,
					statusText: res.statusMessage || '',
					url,
					headers: {
						get(key: string): string | string[] | undefined {
							return res.headers[key.toLowerCase()]
						},
						raw(): http.IncomingHttpHeaders {
							return res.headers
						},
					},
					res,
					err: null,
				})
				return
			}
			const chunks: Array<Buffer> = []
			let received: number = 0
			let aborted: boolean = false
			res.on('error', (err: Error): void => {
				reject({ url, res: null, err, status: httpStatus.ServerError.status, statusText: httpStatus.ServerError.message() })
			})
			res.on('data', (chunk: Buffer): void => {
				if (aborted) {
					return
				}
				received += chunk.length
				/**
				 * 超过响应体上限则中止, 防止内存过爆
				 */
				if (received > maxContentLength) {
					aborted = true
					res.destroy()
					reject({
						url,
						res: null,
						err: new Error('response too large'),
						status: httpStatus.BadGateway.status,
						statusText: httpStatus.BadGateway.message(),
					})
					return
				}
				chunks.push(chunk)
			})
			res.on('end', (): void => {
				if (aborted) {
					return
				}
				const bodyBuffer: Buffer = Buffer.concat(chunks)
				resolve({
					content: bodyBuffer.toString('utf-8'),
					body: bodyBuffer,
					status,
					statusText: res.statusMessage || '',
					url,
					headers: {
						get(key: string): string | string[] | undefined {
							return res.headers[key.toLowerCase()]
						},
						raw(): http.IncomingHttpHeaders {
							return res.headers
						},
					},
					res,
					err: null,
					buffer: async (): Promise<Buffer> => {
						return bodyBuffer
					},
					arrayBuffer: async (): Promise<ArrayBuffer> => {
						const arrayBuffer: ArrayBuffer = new ArrayBuffer(bodyBuffer.length)
						new Uint8Array(arrayBuffer).set(bodyBuffer)
						return arrayBuffer
					},
					text: async (): Promise<string> => {
						return bodyBuffer.toString('utf-8')
					},
					json: async (): Promise<any> => {
						try {
							return JSON.parse(bodyBuffer.toString('utf-8'))
						} catch {
							return null
						}
					},
				})
			})
		})
		req.on('timeout', (): void => {
			req.destroy(new Error('request timeout'))
		})
		req.on('error', (err: Error): void => {
			reject({ url, res: null, err, status: httpStatus.ServerError.status, statusText: httpStatus.ServerError.message() })
		})
		if (optional.body) {
			req.write(optional.body)
		}
		req.end()
	})
}
