const Service = require('../../lib/Service')
const HomeModel = require('../model/home')

class HomeService extends Service {
	constructor() {
		super()
	}

	async fetchData() {
		try {
			const fetchListRes = await HomeModel.fetchData()
			return { ...fetchListRes, serviceKey: 'Key inserted by Service' }
		} catch (e) {
			throw e
		}
	}
}

module.exports = new HomeService()
