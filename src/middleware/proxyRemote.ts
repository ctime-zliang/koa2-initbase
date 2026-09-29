import koa from 'koa'
import { proxyRequest } from '../utils/proxyRequest'
import { TProxyResponse, TKoaContextExtend } from '../types/services'
import { enableProxyRemote, proxyAllowedHosts, proxyRemoteBaseURL } from '../config/proxy'
import { httpStatus } from '../utils/HttpStatus'

const PROXY_HEADER_TAG: string = `x-proxy-loop`

export function isHostAllowed(targetUrl: string): boolean {
	if (proxyAllowedHosts.length === 0) {
		return false
	}
	try {
		const host: string = new URL(targetUrl).host
		return proxyAllowedHosts.includes(host)
	} catch {
		return false
	}
}

const FORWARD_RESPONSE_HEADERS: Array<string> = [
	'content-type',
	'content-disposition',
	'cache-control',
	'last-modified',
	'etag',
	'content-length',
	'content-encoding',
]

export function proxyRemote(app: koa): (ctx: TKoaContextExtend, next: koa.Next) => Promise<void> {
	return async (ctx: TKoaContextExtend, next: koa.Next): Promise<void> => {
		if (ctx.get(PROXY_HEADER_TAG) === '1') {
			await next()
			return
		}
		/**
		 * 仅对"未命中任何路由且尚未产生响应体"的请求做代理处理
		 * 命中路由的请求不会穿透到此处
		 */
		if (ctx.routerMatched || ctx.body != null) {
			await next()
			return
		}
		if (!enableProxyRemote || !proxyRemoteBaseURL) {
			await next()
			return
		}
		const localFullUrl: string = `${ctx.protocol}://${ctx.host}${ctx.url}`.replace(/\/$/i, '')
		const proxyAssetsUrl: string = `${proxyRemoteBaseURL}${localFullUrl.replace(/^(http|https):\/\/[^/]+/, '')}`
		if (!isHostAllowed(proxyAssetsUrl)) {
			ctx.status = httpStatus.Forbidden.status
			ctx.body = httpStatus.Forbidden.message()
			return
		}
		try {
			const proxyResponse: TProxyResponse = await proxyRequest(proxyAssetsUrl, {
				headers: { [PROXY_HEADER_TAG]: '1' },
				/**
				 * 对初始目标及每次重定向目标持续做 host 白名单校验, 防御 SSRF 绕过
				 */
				isUrlAllowed: isHostAllowed,
				/**
				 * 流式转发: 直接把远端响应流 pipe 给客户端, 避免整块响应体缓冲写入内存
				 */
				stream: true,
			})
			if (proxyResponse.headers) {
				for (const headerName of FORWARD_RESPONSE_HEADERS) {
					const headerValue: string | Array<string> | null | undefined = proxyResponse.headers.get(headerName)!
					if (headerValue != null) {
						ctx.set(headerName, Array.isArray(headerValue) ? headerValue.join(', ') : headerValue)
					}
				}
			}
			ctx.status = proxyResponse.status || httpStatus.OK.status
			ctx.body = proxyResponse.body ?? proxyResponse.content
		} catch (e) {
			console.warn(`[proxyRemote] request failed: ${proxyAssetsUrl}`, e)
			ctx.status = httpStatus.BadGateway.status
			ctx.body = httpStatus.BadGateway.message()
		}
	}
}
