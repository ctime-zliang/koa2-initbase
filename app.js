const koa = require('koa')
const path = require('path')
const koaEjs = require('koa-ejs')
const init = require('./lib/init')
const config = require('./config/config')
const envConfig = require('./config/env.export')
const errorHandler = require('./lib/error')
const logger = require('./lib/simpleLogger')
const { eventInit, eventEmitter } = require('./lib/eventInit')
const appEventInit = require('./lib/appEventInit')

const startApp = () => {
	const app = new koa()

	init(app, __dirname)
	eventInit(app)
	appEventInit(app)

	koaEjs(app, {
		root: path.join(__dirname, config.baseConfig.viewDir),
		layout: 'template',
		viewExt: 'ejs',
		cache: false,
		debug: false,
	})

	app.listen(envConfig.port, envConfig.host, async () => {
		logger.trace(`App.running - http://${envConfig.host}:${envConfig.port}`)
		eventEmitter.emit('app/common', `App has finished starting...`)
	})

	return app
}

module.exports = startApp()
