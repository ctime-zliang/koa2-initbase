import koa from 'koa'
import { TKoaContextExtend } from '../types/services'
import { handleError } from './error'

export function koaAppEventInit(app: koa): void {
	app.on('error', (error: Record<string, any>, ctx: TKoaContextExtend): void => {
		const result: string = handleError(error, ctx)
		console.log(result)
	})
}
