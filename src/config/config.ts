import path from 'path'
import { loadEnv } from '../utils/loadEnv'
import { getEnvBoolValue, getEnvNumberValue, getEnvStringList, getEnvValue } from '../utils/envUtils'

export const RUN_MODE: string = loadEnv(process.cwd(), 'development')
export const IS_PRODUCTION: boolean = RUN_MODE === 'production'

export const serverConfig = {
	host: getEnvValue('SERVER_HOST', '127.0.0.1'),
	port: getEnvNumberValue('SERVER_PORT', 8088),
}

/**
 * 视图与静态资源配置
 * 		以当前文件位置为基准
 */
const viewRoot: string = path.join(__dirname, '../app/view')

export const viewConfig = {
	/**
	 * EJS 模板根目录 (koa-ejs 的 root)
	 */
	templateRoot: viewRoot,
	/**
	 * 布局模板(相对 templateRoot, 不含扩展名)
	 */
	layout: 'template/template',
	/**
	 * 模板扩展名
	 */
	viewExt: 'ejs',
	/**
	 * 静态资源目录(相对源码根目录 src / dist)
	 */
	staticPath: '/app/view/static',
	/**
	 * 是否开启缓存: 默认跟随生产环境开启, 可用 VIEW_CACHE 覆盖
	 */
	cache: getEnvBoolValue('VIEW_CACHE', IS_PRODUCTION),
}

/**
 * CORS 配置
 * 		- allowOrigins: 允许的来源白名单; 支持 '*' 表示放行任意来源(此时不允许携带凭证)
 * 		- credentials: 是否允许携带凭证; 仅在来源命中白名单时才回显具体 Origin
 */
const corsAllowOrigins: Array<string> = getEnvStringList('CORS_ALLOW_ORIGINS', ['http://127.0.0.1:8088', 'http://localhost:8088'])
const corsCredentials: boolean = getEnvBoolValue('CORS_CREDENTIALS', true)

/**
 * 拦截危险的 CORS 组合: 通配来源 '*', 不允许与携带凭证 (credentials) 同时开启
 * 		浏览器会拒绝该组合, 若误配将导致跨域凭证请求静默失败, 故在启动阶段直接暴露问题
 */
if (corsAllowOrigins.includes('*') && corsCredentials) {
	throw new Error(
		'[config/cors] Invalid CORS configuration: wildcard origin "*" cannot be used together with credentials=true. ' +
			'需为 CORS_ALLOW_ORIGINS 配置明确的来源白名单, 或将 CORS_CREDENTIALS 设为 false.'
	)
}

export const corsConfig = {
	allowOrigins: corsAllowOrigins,
	credentials: corsCredentials,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
	exposeHeaders: ['Content-Length', 'Content-Type', 'Authorization'],
	maxAge: getEnvNumberValue('CORS_MAX_AGE', 86400),
}

/**
 * 请求体大小限制
 */
export const bodyLimitConfig = {
	jsonLimit: getEnvValue('BODY_JSON_LIMIT', '10mb'),
	formLimit: getEnvValue('BODY_FORM_LIMIT', '10mb'),
	textLimit: getEnvValue('BODY_TEXT_LIMIT', '10mb'),
}

/**
 * 安全响应头配置
 * 		- csp: Content-Security-Policy 值; 传空串则不下发该头
 * 		- hstsEnable: 是否下发 Strict-Transport-Security (仅在 HTTPS 请求上生效)
 * 		- hstsMaxAge: HSTS max-age (秒), 默认 180 天
 * 		- hstsIncludeSubDomains / hstsPreload: HSTS 附加指令
 */
export const securityHeaderConfig = {
	csp: getEnvValue('SECURITY_CSP', "default-src 'self'; base-uri 'self'; frame-ancestors 'self'; object-src 'none'"),
	hstsEnable: getEnvBoolValue('SECURITY_HSTS_ENABLE', IS_PRODUCTION),
	hstsMaxAge: getEnvNumberValue('SECURITY_HSTS_MAX_AGE', 15552000),
	hstsIncludeSubDomains: getEnvBoolValue('SECURITY_HSTS_INCLUDE_SUBDOMAINS', true),
	hstsPreload: getEnvBoolValue('SECURITY_HSTS_PRELOAD', false),
}
