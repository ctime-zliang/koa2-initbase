const koa = require('koa')
const path = require('path')
const koaEjs = require('koa-ejs')
const init = require('./lib/init')
const config = require('./config/config')
const envConfig = require('./config/env.export')
const errorHandler = require('./lib/error')
const logger = require('./lib/simpleLogger')
const eventInit = require('./lib/eventInit')

const startApp = () => {
	const app = new koa()

	init(app, __dirname)

	koaEjs(app, {
		root: path.join(__dirname, config.baseConfig.viewDir),
		layout: 'template',
		viewExt: 'ejs',
		cache: false,
		debug: false,
	})

	eventInit(app)

	app.listen(envConfig.port, envConfig.host, async () => {
		logger.trace(`App.running - http://${envConfig.host}:${envConfig.port}`)
	})

	return app
}

module.exports = startApp()
