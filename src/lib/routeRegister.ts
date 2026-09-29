import koaRouter from 'koa-router'
import koa from 'koa'
import { TKoaContextExtend, TKoaRouteItem } from '../types/services'
import { EHttpMethods } from '../config/enums'
import { httpStatus } from '../utils/HttpStatus'

export function routeRegister(routes: Array<TKoaRouteItem>): koaRouter {
	const kRouter: koaRouter = new koaRouter()
	for (let route of routes) {
		const method: EHttpMethods = route.method
		const path: string = route.path
		kRouter[method](path, async (baseCtx: koa.Context, next: koa.Next): Promise<void> => {
			const ctx: TKoaContextExtend = baseCtx as TKoaContextExtend
			let willGo: boolean = true
			try {
				ctx.status = httpStatus.OK.status
				ctx.routerMatched = true
				if (route.before instanceof Function) {
					willGo = await route.before(ctx, next)
				}
				if (willGo) {
					await route.action.call(kRouter, ctx)
				}
				if (route.after instanceof Function) {
					await route.after(ctx)
				}
				/**
				 * 路由已命中并处理完毕, 不再向下穿透
				 */
			} catch (e: any) {
				/**
				 * 路由处理链 (before / action / after) 抛错:
				 * 		由外层 errorHandler  统一产出标准错误响应与状态码, 避免客户端会收到"状态 200 但空响应体"的错误结果
				 */
				throw e
			}
		})
	}
	return kRouter
}
