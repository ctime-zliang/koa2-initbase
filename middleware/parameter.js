module.exports = options => {
	return async (ctx, next) => {
		ctx.requestParams = {
			...(ctx.request.query || {}),
			...(ctx.request.body || {}),
		}
		await next()
	}
}
