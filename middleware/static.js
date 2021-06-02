const utils = require('../utils/utils')

module.exports = options => {
	return async (ctx, next) => {
		try {
			const { staticPath } = options
			const staticRes = await utils.getStaticContent(ctx, staticPath)
			const { exist, content, type } = staticRes
			if (!exist) {
				await next()
				return
			}
			const staticMime = utils.getMimeType(ctx.url)
			if (staticMime) {
				ctx.staticMime = staticMime
			}
			if (type == utils.ENUM_GET_STATIC_CONTENT.FILE) {
				ctx.res.writeHead(200)
				ctx.res.write(content, 'binary')
				ctx.res.end()
				await next()
				return
			}
			ctx.body = content
			await next()
		} catch (e) {
			ctx.app.emit('error', e)
		}
	}
}
