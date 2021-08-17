const Controller = require('../../lib/Controller')
const RecordService = require('../service/record')
const RecordStatus = require('../status/record')

class RecordController extends Controller {
	constructor() {
		super()
		this.recordService = new RecordService()
	}

	async fetchList(ctx, res) {
		const serRes = await this.recordService.fetchList(ctx.requestParams)
		res.setJson({ ...serRes })
	}

	async addItem(ctx, res) {
		if (!ctx.requestParams.title) {
			res.setMessage(RecordStatus.controller.NO_TITLE.msg)
			res.setRetCode(RecordStatus.controller.NO_TITLE.ret)
			return
		}
		const addItemSerRes = await this.recordService.addItem(ctx.requestParams)
		if (typeof addItemSerRes.ret !== 'undefined' && addItemSerRes.ret !== 0) {
			res.setMessage(addItemSerRes.msg)
			res.setRetCode(addItemSerRes.ret)
			return
		}
		res.setJson({ ...addItemSerRes })
	}

	async delItems(ctx, res) {
		if (typeof ctx.requestParams.ids === 'undefined' || !(ctx.requestParams.ids instanceof Array)) {
			res.setMessage(RecordStatus.controller.INVALID_IDS.msg)
			res.setRetCode(RecordStatus.controller.INVALID_IDS.ret)
			return
		}
		const delItemSerRes = await this.recordService.delItems(ctx.requestParams)
		if (typeof delItemSerRes.ret !== 'undefined' && delItemSerRes.ret !== 0) {
			res.setMessage(delItemSerRes.msg)
			res.setRetCode(delItemSerRes.ret)
			return
		}
		res.setJson({ ...delItemSerRes })
	}

	async fetchItem(ctx, res) {
		if (!ctx.requestParams.id) {
			res.setMessage(RecordStatus.controller.INVALID_ID.msg)
			res.setRetCode(RecordStatus.controller.INVALID_ID.ret)
			return
		}
		const fetchItemSerRes = await this.recordService.fetchItem(ctx.requestParams)
		if (typeof fetchItemSerRes.ret !== 'undefined' && fetchItemSerRes.ret !== 0) {
			res.setMessage(fetchItemSerRes.msg)
			res.setRetCode(fetchItemSerRes.ret)
			return
		}
		res.setJson({ ...fetchItemSerRes })
	}

	async updateItem(ctx, res) {
		if (!ctx.requestParams.id) {
			res.setMessage(RecordStatus.controller.INVALID_ID.msg)
			res.setRetCode(RecordStatus.controller.INVALID_ID.ret)
			return
		}
		if (!ctx.requestParams.title) {
			res.setMessage(RecordStatus.controller.NO_TITLE.msg)
			res.setRetCode(RecordStatus.controller.NO_TITLE.ret)
			return
		}
		const updateItemSerRes = await this.recordService.updateItem(ctx.requestParams)
		if (typeof updateItemSerRes.ret !== 'undefined' && updateItemSerRes.ret !== 0) {
			res.setMessage(updateItemSerRes.msg)
			res.setRetCode(updateItemSerRes.ret)
			return
		}
		res.setJson({ ...updateItemSerRes })
	}
}

module.exports = new RecordController()
