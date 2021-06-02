const dye = require('./dye')
const utils = require('../../utils/utils')

module.exports = options => {
	return async function (ctx, next) {
		const obj = utils.parseUrl(ctx.request.url)
		ctx.res.on('finish', () => {
			dye.handleDyeLog(ctx, options.debug)
		})
		await next()
	}
}
