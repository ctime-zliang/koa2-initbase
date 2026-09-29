import koa from 'koa'
import { TKoaContextExtend } from '../types/services'

function normalizeQuery(query: Record<string, unknown> | undefined): Record<string, unknown> {
	return { ...(query || {}) }
}

export function parameter(app: koa): (ctx: TKoaContextExtend, next: koa.Next) => Promise<void> {
	return async (ctx: TKoaContextExtend, next: koa.Next): Promise<void | undefined> => {
		const query: Record<string, unknown> = normalizeQuery(ctx.request.query as Record<string, unknown>)
		const body: Record<string, unknown> = ((ctx.request as any)?.body as Record<string, unknown>) || {}
		ctx.requestQuery = query
		ctx.requestBody = body
		ctx.requestParams = {
			...query,
			...body,
		}
		await next()
	}
}
