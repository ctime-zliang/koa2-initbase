const Mysql = require('../../lib/Mysql')
const dbConfig = require('../../config/env.export')

class HomeModel extends Mysql {
	constructor() {
		super(dbConfig.database.mainDB, undefined, `id`)
	}

	async fetchData() {
		const res = {
			results: { modelKey: 'Key added by Model' },
		}
		return res.results
	}
}

module.exports = HomeModel
