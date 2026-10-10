import koa from 'koa'
import { EHttpMethods } from '../../config/enums'
import { invokeAPI } from '../../lib/controller/Controller'
import { TKoaContextExtend, TKoaRouteGroup } from '../../types/services'
import { OpenAIController } from '../../app/controller/OpenAIController'

export const openAIAPIRoutes: TKoaRouteGroup = {
	prefix: 'openai',
	desc: 'Open AI',
	routes: [
		{
			desc: 'DeepSeek Open AI',
			method: EHttpMethods.POST,
			path: '/deepseek',
			action: invokeAPI(OpenAIController, 'deepseekAITest'),
			before: async (ctx: TKoaContextExtend, next: koa.Next): Promise<boolean> => {
				return true
			},
			after: async (ctx: TKoaContextExtend): Promise<any> => {},
		},
	],
}
