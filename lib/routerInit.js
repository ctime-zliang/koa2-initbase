const koaRouter = require('koa-router')

module.exports = function routerInit(routes) {
	const kRouter = new koaRouter()
	routes.forEach(routeItem => {
		const method = routeItem.method.toLowerCase()
		const path = routeItem.path
		kRouter[method](path, async (ctx, next) => {
			let willGo = true
			try {
				ctx.status = 200
				ctx.routerMatched = true
				if (typeof routeItem.before == 'function') {
					willGo = await routeItem.before(ctx, next)
				}
				if (willGo) {
					await routeItem.action.call(kRouter, ctx)
				}
				if (typeof routeItem.after == 'function') {
					routeItem.after(ctx)
				}
				await next()
			} catch (e) {
				ctx.app.emit('error', e, ctx)
			}
		})
	})
	return kRouter
}
