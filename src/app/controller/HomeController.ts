import { Controller } from '../../lib/controller/Controller'
import { ServerResponse } from '../../lib/server/ServerResponse'
import { TKoaContextExtend } from '../../types/services'
import { HomeService } from '../service/HomeService'

export class HomeController extends Controller {
	private readonly _viewTemplatePath: string
	private homeService: HomeService
	constructor() {
		super()
		this._viewTemplatePath = `template/home/content`
		this.homeService = new HomeService()
	}

	public async render(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {
		serRes.setView(this._viewTemplatePath, {
			pageTitle: 'Home Page',
		})
	}

	public async getAPITest(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {
		const serviceResult: Record<string, any> = await this.homeService.fetchData()
		serRes.setJson({
			...serviceResult,
			...(ctx.requestParams || {}),
			controllerName: '[home controller] get-api',
		})
	}

	public async postAPITest(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {
		const serviceResult: Record<string, any> = await this.homeService.fetchData()
		serRes.setJson({
			...serviceResult,
			...(ctx.requestParams || {}),
			controllerName: '[home controller] post-api',
		})
	}
}
