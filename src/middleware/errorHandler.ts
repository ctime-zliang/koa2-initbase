import koa from 'koa'
import { TKoaContextExtend } from '../types/services'
import { httpStatus } from '../utils/HttpStatus'
import { responseStatus } from '../utils/ResponseStatus'
import { IS_PRODUCTION } from '../config/config'

/**
 * 从任意抛出的异常中提取 HTTP 状态码
 * 		- 兼容 HttpError(status) 与原生 http-errors(statusCode)
 * 		- 缺省回退 500
 */
function resolveStatus(error: any): number {
	if (error && typeof error === 'object') {
		const status: unknown = error.status ?? error.statusCode
		if (typeof status === 'number' && status >= 400 && status <= 599) {
			return status
		}
	}
	return httpStatus.ServerError.status
}

/**
 * 最外层统一错误处理中间件
 * 		- 处理所有非路由中间件(securityHeaders / compress / bodyParser / koaStatic 等)抛出的异常
 * 		- 统一输出为标准 JSON 响应体, 通过 ctx.app.emit('error') 提交错误
 */
export function errorHandler(): (ctx: TKoaContextExtend, next: koa.Next) => Promise<void> {
	return async (ctx: TKoaContextExtend, next: koa.Next): Promise<void> => {
		try {
			await next()
		} catch (e: any) {
			/**
			 * 响应头已发送(如流式响应 pipe 已开始)时, 无法再改写状态码/响应体
			 * 		- 勿重置 ctx.body, 否则会破坏已输出的字节流或抛出二次异常
			 * 		- 此处仅销毁底层 socket 并上报错误, 交由客户端感知连接中断
			 */
			if (ctx.headerSent || !ctx.writable) {
				ctx.res.destroy()
				ctx.app.emit('error', e, ctx)
				return
			}
			const status: number = resolveStatus(e)
			ctx.status = status
			ctx.type = 'application/json'
			ctx.body = JSON.stringify({
				code: responseStatus.ServiceError.status,
				msg: IS_PRODUCTION ? httpStatus.ServerError.message() : String(e?.message ?? e),
				data: null,
				time: Date.now(),
			})
			ctx.app.emit('error', e, ctx)
		}
	}
}
