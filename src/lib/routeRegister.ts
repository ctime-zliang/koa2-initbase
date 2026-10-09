import koaRouter from 'koa-router'
import koa from 'koa'
import { TKoaContextExtend, TKoaRouteEntry, TKoaRouteGroup, TKoaRouteItem } from '../types/services'
import { EHttpMethods } from '../config/enums'
import { httpStatus } from '../utils/HttpStatus'

function isRouteGroup(routeEntry: TKoaRouteEntry): routeEntry is TKoaRouteGroup {
	return Array.isArray((routeEntry as TKoaRouteGroup).routes)
}

function joinPath(prefix: string, path: string): string {
	const normalizedPrefix: string = prefix.replace(/^\/+|\/+$/g, '')
	const normalizedPath: string = path.replace(/^\/+/, '')
	const segments: Array<string> = [normalizedPrefix, normalizedPath].filter((seg: string): boolean => {
		return seg.length > 0
	})
	return '/' + segments.join('/')
}

function flattenRoutes(routeEntries: Array<TKoaRouteEntry>): Array<TKoaRouteItem> {
	const flat: Array<TKoaRouteItem> = []
	for (let routeEntry of routeEntries) {
		if (isRouteGroup(routeEntry)) {
			for (let route of routeEntry.routes) {
				flat.push({ ...route, path: joinPath(routeEntry.prefix, route.path) })
			}
		} else {
			flat.push(routeEntry)
		}
	}
	return flat
}

export function routeRegister(routeEntries: Array<TKoaRouteEntry>): koaRouter {
	const kRouter: koaRouter = new koaRouter()
	const routes: Array<TKoaRouteItem> = flattenRoutes(routeEntries)
	for (let route of routes) {
		kRouter[route.method as EHttpMethods](route.path, async (baseCtx: koa.Context, next: koa.Next): Promise<void> => {
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
