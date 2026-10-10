import { Controller } from '../../lib/controller/Controller'
import { ServerResponse } from '../../lib/response/ServerResponse'
import { TKoaContextExtend } from '../../types/services'
import { BaiDuTranslationService } from '../service/BaiDuTranslationService'
import { BaiDuTranslationStatus } from '../status/BaiDuTranslationStatus'

export class BaiDuTranslationController extends Controller {
	private readonly baiduTranslationStatusStatus: BaiDuTranslationStatus
	private readonly baiduTranslationService: BaiDuTranslationService
	constructor() {
		super()
		this.baiduTranslationStatusStatus = new BaiDuTranslationStatus()
		this.baiduTranslationService = new BaiDuTranslationService()
	}

	public async render(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {}

	public async baiDuTranslation(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {
		const { sourceLang, items = [] } = ctx.requestParams || {}
		const serviceResult: { status: number; message: string; data: any } = await this.baiduTranslationService.baiduTranslation(
			sourceLang as string,
			items as Array<{ id: string; target: string; text: string }>
		)
		this.applyServiceResult(serRes, serviceResult)
	}
}
