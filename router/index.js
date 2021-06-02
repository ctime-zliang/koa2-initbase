const webRouter = require('./web')
const apiRouter = require('./api')
const errRouterMap = require('./error')

const routerList = [webRouter, apiRouter]

module.exports = koaApp => {
	koaApp.use(async (ctx, next) => {
		if (errRouterMap[String(ctx.status)]) {
			await errRouterMap[String(ctx.status)](ctx)
		}
		await next()
	})
	routerList.forEach((router, index) => {
		koaApp.use(router.routes())
		koaApp.use(router.allowedMethods())
	})
}
