const Mysql = require('../../lib/Mysql')
const dbConfig = require('../../config/env.export')

class RecordModel extends Mysql {
	constructor() {
		super(dbConfig.database.mainDB, `tb_record`, `id`)
	}

	async fetchList(params) {
		const listSqlString = params.keywords
			? this.sql()
					.select('*')
					.from(this.table)
					.whereLike({
						title: params.keywords,
					})
					.sort('id', true)
					.page(params.pageIndex, params.pageSize)
					.toString()
			: this.sql().select('*').from(this.table).sort('id', true).page(params.pageIndex, params.pageSize).toString()
		const countSqlString = params.keywords
			? this.sql()
					.select(`COUNT(*)`)
					.from(this.table)
					.whereLike({
						title: params.keywords,
					})
					.toString()
			: this.sql().select(`COUNT(*)`).from(this.table).toString()
		const listRes = await this.query(listSqlString)
		const countRes = await this.query(countSqlString)
		return {
			list: listRes.results,
			count: countRes.results,
		}
	}

	async fetchItem(params) {
		const res = await this.query(
			this.sql()
				.select('*')
				.from(this.table)
				.where({
					id: params.id,
				})
				.toString()
		)
		return res.results
	}

	async addItem(params) {
		const res = await this.query(
			this.sql()
				.insert(this.table)
				.set({
					title: params.title,
					content: params.content || '',
					extra: params.extra || '',
				})
				.toString()
		)
		return res.results
	}

	async delItem(params) {
		const res = await this.query(
			this.sql()
				.del(this.table)
				.where({
					id: params.id,
				})
				.toString()
		)
		return res.results
	}

	async updateItem(params) {
		const res = await this.query(
			this.sql()
				.update(this.table)
				.set({
					title: params.title,
					content: params.content || '',
					extra: params.extra || '',
				})
				.where({
					id: params.id,
				})
				.toString()
		)
		return res.results
	}
}

module.exports = new RecordModel()
