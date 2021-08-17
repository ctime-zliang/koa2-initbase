const koaRouter = require('koa-router')

module.exports = function routerExec(routes) {
	const kRouter = new koaRouter()
	routes.forEach((routeItem, index) => {
		kRouter[routeItem.method.toLowerCase()](routeItem.path, async (ctx, next) => {
			try {
				ctx.status = 200
				ctx.routerMatched = true
				await routeItem.action.call(kRouter, ctx, next)
				// await next()
			} catch (e) {
				ctx.app.emit('error', e, ctx)
			}
		})
	})
	return kRouter
}
