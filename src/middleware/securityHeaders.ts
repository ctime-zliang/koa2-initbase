import koa from 'koa'
import { TKoaContextExtend } from '../types/services'
import { securityHeaderConfig } from '../config/config'

/**
 * 构建 Strict-Transport-Security 头值
 */
function buildHstsValue(): string {
	const directives: Array<string> = [`max-age=${securityHeaderConfig.hstsMaxAge}`]
	if (securityHeaderConfig.hstsIncludeSubDomains) {
		directives.push('includeSubDomains')
	}
	if (securityHeaderConfig.hstsPreload) {
		directives.push('preload')
	}
	return directives.join('; ')
}

/**
 * 设置基础安全响应头:
 * 		- X-Content-Type-Options: nosniff  // 禁止浏览器 MIME 嗅探
 * 		- X-Frame-Options: SAMEORIGIN  // 防点击劫持
 * 		- Referrer-Policy: no-referrer  // 控制 Referer 泄露
 * 		- X-DNS-Prefetch-Control: off  // 关闭 DNS 预取
 * 		- X-Download-Options: noopen  // IE 下载安全
 * 		- Cross-Origin-Opener-Policy: same-origin  // 隔离浏览上下文
 * 		- Content-Security-Policy  // 抵御 XSS / 数据注入, 是 XSS 防护的关键一环
 * 		- Strict-Transport-Security  // 强制 HTTPS (仅在 HTTPS 请求上下发)
 * 		- 移除 X-Powered-By  // 隐藏技术栈指纹
 */
export function securityHeaders(): (ctx: TKoaContextExtend, next: koa.Next) => Promise<void> {
	const hstsValue: string = buildHstsValue()
	return async (ctx: TKoaContextExtend, next: koa.Next): Promise<void> => {
		ctx.set('X-Content-Type-Options', 'nosniff')
		ctx.set('X-Frame-Options', 'SAMEORIGIN')
		ctx.set('Referrer-Policy', 'no-referrer')
		ctx.set('X-DNS-Prefetch-Control', 'off')
		ctx.set('X-Download-Options', 'noopen')
		ctx.set('Cross-Origin-Opener-Policy', 'same-origin')
		if (securityHeaderConfig.csp) {
			ctx.set('Content-Security-Policy', securityHeaderConfig.csp)
		}
		/**
		 * HSTS 仅对通过 HTTPS 到达的请求有意义, 明文 HTTP 下下发会被浏览器忽略且无益
		 */
		if (securityHeaderConfig.hstsEnable && ctx.secure) {
			ctx.set('Strict-Transport-Security', hstsValue)
		}
		ctx.remove('X-Powered-By')
		await next()
	}
}
