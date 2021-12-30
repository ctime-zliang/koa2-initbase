const httpStatus = require('./HttpStatus')

const TYPE_JSON = `json`
const TYPE_HTML = `html`
const TYPE_TEXT = `text`
const TYPE_BINARY = `binary`

class Response {
	constructor() {
		this.data = null
		this.msg = ''
		this.status = 200
		this.retCode = 0
		this.outType = TYPE_JSON
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

	flush(ctx) {
		switch (this.outType) {
			case TYPE_JSON: {
				if (this.status === httpStatus.Ok.status) {
					ctx.body = JSON.stringify({
						ret: this.retCode,
						msg: this.msg,
						data: this.data,
						time: Date.now(),
					})
					return this
				}
				ctx.status = this.status
				ctx.body = this.msg
				return this
			}
			case TYPE_HTML: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			case TYPE_TEXT: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			case TYPE_BINARY: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			default: {
				ctx.status = this.status
				ctx.body = this.data
			}
		}
	}

	setJson(data = null) {
		this.outType = TYPE_JSON
		this.data = data
		return this
	}

	setHtml(data = null) {
		this.outType = TYPE_HTML
		this.data = data
		return this
	}

	setBinary(data = null) {
		this.outType = TYPE_BINARY
		this.data = data
		return this
	}

	setText(data = null) {
		this.outType = TYPE_TEXT
		this.data = data
		return this
	}
}

module.exports = Response
