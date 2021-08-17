const HomeModel = require('../model/home')

class HomeService {
	constructor() {
		this.homeModel = new HomeModel()
	}

	async fetchData() {
		try {
			const fetchListRes = await this.homeModel.fetchData()
			return { ...fetchListRes, serviceKey: 'Key inserted by Service' }
		} catch (e) {
			throw e
		}
	}
}

module.exports = HomeService
