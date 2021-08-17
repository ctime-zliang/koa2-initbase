module.exports = () => {
	return async (ctx, next) => {
		if (['/favicon.ico'].includes(ctx.originalUrl)) {
			ctx.body = ``
			return
		}
		await next()
	}
}
