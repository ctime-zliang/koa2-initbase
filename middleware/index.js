const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const path = require('path')
const koaCors = require('koa-cors')
const config = require('../config/config')
const router = require('../router')
const parameter = require('./parameter')
const auth = require('./auth')
const mstatic = require('./static')
const dyeLog = require('./dyelog')
const interceptor = require('./interceptor')

module.exports = (app, __rootDirname) => {
	app.use(interceptor())
	app.use(
		koaCors({
			origin(ctx) {
				return ctx.header.origin
			},
			exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
			credentials: true,
			allowMethods: ['GET', 'POST', 'DELETE'],
			allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
		})
	)
	app.use(bodyParser())
	app.use(parameter({}))
	app.use(auth({}))
	app.use(
		dyeLog({
			...config.baseConfig,
			debug: true,
		})
	)
	app.use(
		mstatic({
			staticPath: path.join(__rootDirname, config.baseConfig.staticDir),
		})
	)
	router(app)
	app.use(async (ctx, next) => {
		console.log(`==================>>>>> After Router`)
		await next()
	})
}
