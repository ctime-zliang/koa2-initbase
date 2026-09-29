import { HomeModel } from '../model/HomeModel'

export class HomeService {
	private homeModel: HomeModel
	constructor() {
		this.homeModel = new HomeModel()
	}

	async fetchData(): Promise<Record<string, any>> {
		const fetchListRes: Record<string, any> = await this.homeModel.fetchData()
		return { ...fetchListRes, serviceName: '[home service]' }
	}
}
