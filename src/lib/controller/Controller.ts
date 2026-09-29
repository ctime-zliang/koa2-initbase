import { TKoaContextExtend } from '../../types/services'
import { httpStatus } from '../../utils/HttpStatus'
import { responseStatus } from '../../utils/ResponseStatus'
import { IS_PRODUCTION } from '../../config/config'
import { ServerResponse } from '../server/ServerResponse'
import { BaseController } from './BaseController'

export abstract class Controller extends BaseController {
	private _options: Record<string, any> = {}
	constructor(options: Record<string, any> = {}) {
		super()
		this._options = { ...options }
	}

	public invokeRender(): (ctx: TKoaContextExtend) => Promise<void> {
		return async (ctx: TKoaContextExtend): Promise<void> => {
			const render = (this as Controller).render
			const serRes: ServerResponse = new ServerResponse()
			if (!render) {
				ctx.body = `Missing render method in Controller!`
				ctx.status = httpStatus.ServerError.status
				return
			}
			try {
				await render.call(this, ctx, serRes)
				if (serRes.isSet) {
					await serRes.flush(ctx)
				}
			} catch (e: any) {
				ctx.status = httpStatus.ServerError.status
				ctx.type = 'text/html'
				ctx.body = IS_PRODUCTION ? httpStatus.ServerError.message() : `Render Error: ${String(e?.message ?? e)}`
				ctx.app.emit('error', e, ctx)
			}
		}
	}

	public invokeAPI(actionName: string): (ctx: TKoaContextExtend) => Promise<void> {
		const func: (ctx: TKoaContextExtend, serRes: ServerResponse) => Promise<void> = (this as any)[actionName]
		if (typeof func !== 'function') {
			throw new ReferenceError(`${actionName} action non-existent.`)
		}
		return async (ctx: TKoaContextExtend): Promise<void> => {
			ctx.controller = { ...this._options, actionName }
			const serRes: ServerResponse = new ServerResponse()
			serRes.resetDefaults(httpStatus.OK.status, responseStatus.OK.status, responseStatus.OK.message())
			try {
				await func.call(this, ctx, serRes)
				if (serRes.isSet) {
					await serRes.flush(ctx)
				}
			} catch (e: any) {
				serRes.status = httpStatus.ServerError.status
				serRes.code = httpStatus.ServerError.status
				serRes.msg = httpStatus.ServerError.message()
				serRes.setJson(null)
				await serRes.flush(ctx)
				ctx.app.emit('error', e, ctx)
			}
		}
	}
}

type TControllerActionName<T> = {
	[K in keyof T]: K extends keyof Controller ? never : K extends string ? (T[K] extends (...args: any[]) => any ? K : never) : never
}[keyof T]

export function invokeRender<T extends Controller>(controller: new (...args: any[]) => T): (ctx: TKoaContextExtend) => Promise<void> {
	return new controller().invokeRender()
}

export function invokeAPI<T extends Controller>(
	controller: new (...args: any[]) => T,
	method: TControllerActionName<T>
): (ctx: TKoaContextExtend) => Promise<void> {
	return new controller().invokeAPI(method)
}
