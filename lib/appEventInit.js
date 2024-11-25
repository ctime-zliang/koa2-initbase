const errorHandler = require('./error')

module.exports = app => {
	app.on('error', (error, ctx) => {
		const result = errorHandler(error, ctx)
		console.log(result)
	})
}
