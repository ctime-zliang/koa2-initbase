const RecordModel = require('../model/record')
const RecordStatus = require('../status/record')

class RecordService {
	constructor() {
		this.recordModel = new RecordModel()
	}

	async fetchList(params) {
		try {
			const pageIndex = +params.pageIndex || 1
			const pageSize = +params.pageSize || 5
			const fetchListRes = await this.recordModel.fetchList({ ...params, pageSize, pageIndex })
			return {
				pageIndex,
				pageSize,
				countTotal: fetchListRes.count && fetchListRes.count.length ? fetchListRes.count[0]['COUNT(*)'] : 0,
				list: fetchListRes.list,
			}
		} catch (e) {
			throw e
		}
	}

	async addItem(params) {
		try {
			const addItemRes = await this.recordModel.addItem(params)
			if (!addItemRes.affectedRows) {
				return { ...RecordStatus.service.WRITE_ITEM_FAILER }
			}
			const fetchItemRes = await this.recordModel.fetchItem({ id: addItemRes.insertId })
			if (!fetchItemRes || !fetchItemRes.length) {
				return { ...RecordStatus.service.READ_NEW_ROW_FAILER }
			}
			return { ...fetchItemRes[0] }
		} catch (e) {
			throw e
		}
	}

	async delItems(params) {
		try {
			for (let i = 0; i < params.ids.length; i++) {
				const delItemRes = await this.recordModel.delItem({ id: params.ids[i] })
				if (!delItemRes.affectedRows) {
					throw { ...RecordStatus.service.DELETE_ITEM_FAILER }
				}
			}
			return {}
		} catch (e) {
			throw e
		}
	}

	async fetchItem(params) {
		try {
			const fetchItemRes = await this.recordModel.fetchItem({ id: params.id })
			if (!fetchItemRes || !fetchItemRes.length) {
				return { ...RecordStatus.service.READ_TARGET_ROW_FAILER }
			}
			return { ...fetchItemRes[0] }
		} catch (e) {
			throw e
		}
	}

	async updateItem(params) {
		try {
			const updateItemmRes = await this.recordModel.updateItem(params)
			if (!updateItemmRes.affectedRows) {
				return { ...RecordStatus.service.UPDATE_ITEM_FAILER }
			}
			const fetchItemRes = await this.recordModel.fetchItem({ id: params.id })
			if (!fetchItemRes || !fetchItemRes.length) {
				return { ...RecordStatus.service.READ_TARGET_ROW_FAILER }
			}
			return { ...fetchItemRes[0] }
		} catch (e) {
			throw e
		}
	}
}

module.exports = RecordService
