import koa from 'koa'
import { HomeController } from '../../app/controller/HomeController'
import { EHttpMethods } from '../../config/enums'
import { invokeAPI } from '../../lib/controller/Controller'
import { TKoaContextExtend, TKoaRouteItem } from '../../types/services'

export const homeAPIRoutes: Array<TKoaRouteItem> = [
	{
		desc: 'Home Get API',
		method: EHttpMethods.GET,
		path: '/getAPITest',
		action: invokeAPI(HomeController, 'getAPITest'),
		before: async (ctx: TKoaContextExtend, next: koa.Next): Promise<boolean> => {
			return true
		},
		after: async (ctx: TKoaContextExtend): Promise<any> => {},
	},
	{
		desc: 'Home Post API',
		method: EHttpMethods.POST,
		path: '/postAPITest',
		action: invokeAPI(HomeController, 'postAPITest'),
		before: async (ctx: TKoaContextExtend, next: koa.Next): Promise<boolean> => {
			return true
		},
		after: async (ctx: TKoaContextExtend): Promise<any> => {},
	},
]
