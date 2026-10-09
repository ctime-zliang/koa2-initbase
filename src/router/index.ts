import koa from 'koa'
import koaRouter from 'koa-router'
import { homeAPIRoutes } from './api/home'
import { homePageRoutes } from './web/home'
import { routeRegister } from '../lib/routeRegister'
import { translationAPIRoutes } from './api/translation'

export function applyRouter(app: koa): void {
	const apiRouter: koaRouter = routeRegister([homeAPIRoutes, translationAPIRoutes])
	const pageRouter: koaRouter = routeRegister([...homePageRoutes])
	const routers: Array<koaRouter> = [apiRouter, pageRouter]
	for (let router of routers) {
		app.use(router.routes())
		app.use(router.allowedMethods())
	}
}
