const Controller = require('../../lib/Controller')
const HomeService = require('../service/home')

class RtestController extends Controller {
	constructor() {
		super()
		this.homeService = new HomeService()
	}

	async render(ctx) {
		const title = `koa msvc`
		/* 渲染视图 */
		await ctx.render('./home/main', {
			title: title,
		})
	}

	async rtest(ctx, res) {
		const query = ctx.query
		const serRes = await this.homeService.fetchData()
		res.setJson({
			...serRes,
			...query,
			controllerKey: 'Key inserted by Controller',
		})
	}
}

module.exports = new RtestController()
