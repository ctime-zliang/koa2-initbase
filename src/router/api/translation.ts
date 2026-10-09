import koa from 'koa'
import { EHttpMethods } from '../../config/enums'
import { invokeAPI } from '../../lib/controller/Controller'
import { TKoaContextExtend, TKoaRouteGroup } from '../../types/services'
import { BaiDuTranslationController } from '../../app/controller/BaiDuTranslationController'

export const translationAPIRoutes: TKoaRouteGroup = {
	prefix: 'translation',
	desc: 'Translation API Group',
	routes: [
		{
			desc: 'Baidu Translation API',
			method: EHttpMethods.POST,
			path: '/baiduTranslation',
			action: invokeAPI(BaiDuTranslationController, 'baiDuTranslation'),
			before: async (ctx: TKoaContextExtend, next: koa.Next): Promise<boolean> => {
				return true
			},
			after: async (ctx: TKoaContextExtend): Promise<any> => {},
		},
	],
}
