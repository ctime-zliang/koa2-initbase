const Controller = require('../../lib/Controller')
const RecordService = require('../service/record')
const RecordStatus = require('../status/record')

class RecordController extends Controller {
	constructor() {
		super({
			controllerName: 'Record Controller',
		})
	}

	async fetchList(ctx, res) {
		const serRes = await RecordService.invokeService('fetchList', ctx.requestParams)
		res.setData({ ...serRes })
	}

	async addItem(ctx, res) {
		if (!ctx.requestParams.title) {
			res.setMessage(RecordStatus.controller.NO_TITLE.msg)
			res.setRetCode(RecordStatus.controller.NO_TITLE.ret)
			return
		}
		const addItemSerRes = await RecordService.invokeService('addItem', ctx.requestParams)
		if (typeof addItemSerRes.ret !== 'undefined' && addItemSerRes.ret !== 0) {
			res.setMessage(addItemSerRes.msg)
			res.setRetCode(addItemSerRes.ret)
			return
		}
		res.setData({ ...addItemSerRes })
	}

	async delItems(ctx, res) {
		if (typeof ctx.requestParams.ids === 'undefined' || !(ctx.requestParams.ids instanceof Array)) {
			res.setMessage(RecordStatus.controller.INVALID_IDS.msg)
			res.setRetCode(RecordStatus.controller.INVALID_IDS.ret)
			return
		}
		const delItemSerRes = await RecordService.invokeService('delItems', ctx.requestParams)
		if (typeof delItemSerRes.ret !== 'undefined' && delItemSerRes.ret !== 0) {
			res.setMessage(delItemSerRes.msg)
			res.setRetCode(delItemSerRes.ret)
			return
		}
		res.setData({ ...delItemSerRes })
	}

	async fetchItem(ctx, res) {
		if (!ctx.requestParams.id) {
			res.setMessage(RecordStatus.controller.INVALID_ID.msg)
			res.setRetCode(RecordStatus.controller.INVALID_ID.ret)
			return
		}
		const fetchItemSerRes = await RecordService.invokeService('fetchItem', ctx.requestParams)
		if (typeof fetchItemSerRes.ret !== 'undefined' && fetchItemSerRes.ret !== 0) {
			res.setMessage(fetchItemSerRes.msg)
			res.setRetCode(fetchItemSerRes.ret)
			return
		}
		res.setData({ ...fetchItemSerRes })
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
		const updateItemSerRes = await RecordService.invokeService('updateItem', ctx.requestParams)
		if (typeof updateItemSerRes.ret !== 'undefined' && updateItemSerRes.ret !== 0) {
			res.setMessage(updateItemSerRes.msg)
			res.setRetCode(updateItemSerRes.ret)
			return
		}
		res.setData({ ...updateItemSerRes })
	}
}

module.exports = new RecordController()
