import { BaseService } from '../../lib/service/BaseService'
import { HomeModel } from '../model/HomeModel'

export class HomeService extends BaseService {
	private readonly homeModel: HomeModel
	constructor() {
		super()
		this.homeModel = new HomeModel()
	}

	async fetchData(): Promise<Record<string, any>> {
		const fetchListRes: Record<string, any> = await this.homeModel.fetchData()
		return { ...fetchListRes, serviceName: '[home service]' }
	}
}
