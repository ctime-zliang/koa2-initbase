const HomeModel = require('../model/home')

class HomeService {
	constructor() {
		this.homeModel = new HomeModel()
	}

	async fetchData() {
		const fetchListRes = await this.homeModel.fetchData()
		return { ...fetchListRes, serviceKey: 'Key added by Service' }
	}
}

module.exports = HomeService
