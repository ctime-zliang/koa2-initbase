const koaRouter = require('koa-router')

module.exports = function routerExec(routes) {
	const kRouter = new koaRouter()
	routes.forEach((routeItem, index) => {
		kRouter[routeItem.method.toLowerCase()](routeItem.path, async (ctx, next) => {
			ctx.routerMatched = true
			await next()
			await routeItem.action.call(kRouter, ctx, next)
		})
	})
	return kRouter
}
