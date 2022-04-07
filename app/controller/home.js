const Controller = require('../../lib/Controller')
const HomeService = require('../service/home')

class HomeController extends Controller {
	constructor() {
		super()
		this.homeService = new HomeService()
	}

	async render(ctx) {
		const title = `koa msvc`
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
			controllerKey: 'Key added by Controller',
		})
	}
}

module.exports = HomeController
