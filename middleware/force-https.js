module.exports = options => {
	return async (ctx, next) => {
		const isProduction = !process.env.NODE_DEV_ENV && !process.env.NODE_TEST_ENV
		if (isProduction && ctx.request.protocol !== 'https') {
			const host = ctx.request.host.split(':')[0]
			const port = ctx.request.host.split(':')[1]
			const redirectLink = host + (port ? `:${port}` : '') + ctx.request.url
			ctx.redirect('https://' + redirectLink)
			const info = 'force-https|url:' + 'https://' + redirectLink + '|protocol:' + ctx.request.protocol
			return false
		}
		await next()
	}
}
