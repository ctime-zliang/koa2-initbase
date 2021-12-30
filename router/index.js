const webRouter = require('./web')
const apiRouter = require('./api')
const errRouterMap = require('./error')

const routerList = [webRouter, apiRouter]

module.exports = koaApp => {
	routerList.forEach(router => {
		koaApp.use(router.routes())
		koaApp.use(router.allowedMethods())
	})
	koaApp.use(async (ctx, next) => {
		if (!ctx.routerMatched && errRouterMap[String(ctx.status)]) {
			await errRouterMap[String(ctx.status)](ctx)
		}
		await next()
	})
}
