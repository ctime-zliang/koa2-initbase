import koa from 'koa'
import http from 'http'
import { EHttpMethods } from '../config/enums'

export type TKoaRouteItem = {
	method: EHttpMethods
	path: string
	desc?: string
	action: (ctx: TKoaContextExtend) => Promise<void>
	before?: (ctx: TKoaContextExtend, next: koa.Next) => Promise<boolean>
	after?: (ctx: TKoaContextExtend) => Promise<void>
}

export type TControllerMeta = {
	actionName: string
	[key: string]: unknown
}

export type TKoaContextExtend = {
	/**
	 * 合并视图: query 与 body 同名时 body 覆盖 query
	 */
	requestParams?: Record<string, unknown>
	/**
	 * 仅 URL 查询参数 (值可能为 string | string[])
	 */
	requestQuery?: Record<string, unknown>
	/**
	 * 仅请求体参数
	 */
	requestBody?: Record<string, unknown>
	routerMatched?: boolean
	controller?: TControllerMeta
	render: (viewPath: string, params?: Record<string, any>) => Promise<void>
} & koa.Context

export type TErrorExtend = Error & {
	status: number
}

export type TProxyResponseHeaders = {
	get: (key: string) => string | string[] | null | undefined
	raw?: () => http.IncomingHttpHeaders
	set?: (key: string, value: string) => void
}

export type TProxyResponse = {
	readonly headers?: TProxyResponseHeaders
	/**
	 * 响应体的文本形式 (流式模式下为空串)
	 */
	readonly content: string
	/**
	 * 响应体:
	 * 		- 缓冲模式: 原始字节 Buffer (二进制安全)
	 * 		- 流式模式: 原始可读流 (http.IncomingMessage)
	 */
	readonly body?: Buffer | http.IncomingMessage
	/**
	 * 是否为流式响应 (body 为可读流)
	 */
	readonly isStream?: boolean
	readonly status: number
	readonly statusText?: string
	readonly url: string
	readonly res: http.IncomingMessage | null
	readonly err: unknown
	readonly buffer?: () => Promise<Buffer>
	readonly arrayBuffer?: () => Promise<ArrayBuffer>
	readonly json?: () => Promise<any>
	readonly text?: () => Promise<string>
}
