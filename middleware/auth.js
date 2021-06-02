const utils = require('../utils/utils')
const httpStatus = require('../lib/httpStatus')

const AUTH_COOKIE_NAME = `LOGIN_AUTH_TAG`
const authDefaultMessage = ctx => {
	const redirectLink = `${ctx.request.protocol}://${ctx.request.host}`
	return `
		<div>示例性权限验证: 请先访问<a href="${redirectLink}" target="blank">首页</a>以生成一个认证 cookie 后再访问此地址</div>
	`
}

module.exports = options => {
	return async (ctx, next) => {
		if (ctx.request.url == '' || ctx.request.url == '/') {
			utils.cookie.set(ctx, AUTH_COOKIE_NAME, String(Date.now()))
			await next()
			return
		}
		const authValue = utils.cookie.get(ctx, AUTH_COOKIE_NAME)
		if (!authValue) {
			ctx.status = httpStatus.Forbidden.status
			ctx.body = authDefaultMessage(ctx)
			return
		}
		await next()
	}
}
