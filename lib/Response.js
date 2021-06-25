const httpStatus = require('./httpStatus')

const STATUS_KEYS = Object.keys(httpStatus)
class Response {
	constructor() {
		this._keepJSON = false
		this.data = null
		this.msg = ''
		this.status = 200
		this.retCode = 0
	}

	setStatus(status = 200) {
		this.status = status
		return this
	}

	setRetCode(retCode = 0) {
		this.retCode = retCode
		return this
	}

	setMessage(message) {
		this.msg = message
		return this
	}

	setData(data = null) {
		this.data = data
		return this
	}

	setKeepJSON(toggle = false) {
		this._keepJSON = toggle
		return this
	}

	flush(ctx) {
		if (this.status === httpStatus.Ok.status) {
			ctx.status = httpStatus.Ok.status
			ctx.body = JSON.stringify({
				ret: this.retCode,
				msg: this.msg,
				data: this.data,
				time: Date.now(),
			})
			return this
		}
		ctx.status = this.status
		if (this._keepJSON) {
			ctx.body = JSON.stringify({
				ret: this.retCode,
				msg: this.msg,
				data: this.data,
				time: Date.now(),
			})
			return this
		}
		ctx.body = this.msg
		return this
	}
}

module.exports = Response
