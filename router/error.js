const Response = require('../lib/Response')

module.exports = {
	404: async ctx => {
		ctx.status = 404
		if (ctx.method.toLowerCase() === 'post') {
			const res = new Response()
			res.setRetCode(-1).setStatus(ctx.status).setText('API Not Found').flush(ctx)
			return ''
		}
		ctx.body = `
            <section style="font-size: 30px; color: #000000; font-weight: 900; text-align: center;">404 Not Found. Router</section>
        `
	},
}
