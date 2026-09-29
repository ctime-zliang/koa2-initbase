import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaCors from '@koa/cors'
import { parameter } from './parameter'
import { TKoaContextExtend } from '../types/services'
import { applyRouter } from '../router'
import { proxyRemote } from './proxyRemote'
import { securityHeaders } from './securityHeaders'
import { compress } from './compress'
import { errorHandler } from './errorHandler'
import { koaStatic } from '../lib/koaStatic'
import { corsConfig, bodyLimitConfig, viewConfig, IS_PRODUCTION } from '../config/config'

export function middleware(app: koa): void {
	/**
	 * 隐藏技术栈指纹
	 */
	app.proxy = false
	/**
	 * 最外层统一错误处理
	 * 		必须为首个注册的中间件
	 */
	app.use(errorHandler())
	/**
	 * 安全响应头
	 * 		尽量靠外, 使所有响应(含静态资源)都带上安全头
	 */
	app.use(securityHeaders())
	/**
	 * CORS
	 * 		紧跟安全头之后, 让跨域预检 (OPTIONS) 尽早短路返回, 不必走完整链路
	 */
	app.use(
		koaCors({
			/**
			 * 是否允许携带 Cookie 等凭证
			 */
			credentials: (): boolean => {
				return corsConfig.credentials
			},
			/**
			 * 允许的请求来源: 命中白名单才回显具体 Origin; 配置 "*" 时放行任意来源(勿同时开启 credentials)
			 */
			origin: (ctx: koa.Context): string => {
				const requestOrigin: string = ctx.get('Origin') || ''
				if (corsConfig.allowOrigins.includes('*')) {
					return '*'
				}
				if (requestOrigin && corsConfig.allowOrigins.includes(requestOrigin)) {
					return requestOrigin
				}
				/**
				 * 非白名单来源: 返回空串, 不下发 Access-Control-Allow-Origin
				 */
				return ''
			},
			allowMethods: corsConfig.methods,
			allowHeaders: corsConfig.allowHeaders,
			exposeHeaders: corsConfig.exposeHeaders,
			maxAge: corsConfig.maxAge,
		})
	)
	/**
	 * 响应压缩: 位于 CORS 之后, 业务/静态资源之前, 统一处理下行内容压缩
	 */
	app.use(compress())
	/**
	 * 静态资源服务: 在此统一挂载, 保证静态请求同样经过上方的
	 * 		errorHandler / securityHeaders / cors / compress 中间件
	 */
	app.use(
		koaStatic({
			path: viewConfig.staticPath,
			maxage: viewConfig.cache ? 1000 * 60 * 60 * 24 : 0,
			gzip: true,
		})
	)
	app.use(
		bodyParser({
			jsonLimit: bodyLimitConfig.jsonLimit,
			formLimit: bodyLimitConfig.formLimit,
			textLimit: bodyLimitConfig.textLimit,
		})
	)
	app.use(parameter(app))
	applyRouter(app)
	app.use(proxyRemote(app))
	if (!IS_PRODUCTION) {
		app.use(async (ctx: TKoaContextExtend, next: koa.Next): Promise<void> => {
			console.log(`==================>>> [after koa route]: ${ctx.path} <<<==================`)
			await next()
		})
	}
}
