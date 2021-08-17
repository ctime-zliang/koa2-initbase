const koa = require('koa')
const path = require('path')
const koaEjs = require('koa-ejs')
const init = require('./lib/init')
const config = require('./config/config')
const envConfig = require('./config/env.export')
const errorHandler = require('./error')
const logger = require('./lib/simple-logger')
const middleware = require('./middleware')

const app = new koa()

init(app)

koaEjs(app, {
	root: path.join(__dirname, config.baseConfig.viewDir),
	layout: 'template',
	viewExt: 'ejs',
	cache: false,
	debug: false,
})

middleware(app, __dirname)

app.on('error', (error, ctx) => {
	const result = errorHandler(error, ctx)
	console.log(result)
})

app.listen(envConfig.port, envConfig.host, async () => {
	logger.trace(`App.running - http://${envConfig.host}:${envConfig.port}`)
})

module.exports = app
