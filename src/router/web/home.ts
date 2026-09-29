import koa from 'koa'
import { HomeController } from '../../app/controller/HomeController'
import { EHttpMethods } from '../../config/enums'
import { invokeRender } from '../../lib/controller/Controller'
import { TKoaContextExtend, TKoaRouteItem } from '../../types/services'

export const homePageRoutes: Array<TKoaRouteItem> = [
	{
		desc: 'Home Page',
		method: EHttpMethods.GET,
		path: '/',
		action: invokeRender(HomeController),
		before: async (ctx: TKoaContextExtend, next: koa.Next): Promise<boolean> => {
			return true
		},
		after: async (ctx: TKoaContextExtend): Promise<any> => {},
	},
]
