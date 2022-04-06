const EventEmitter = require('events')
const Response = require('./Response')
const httpStatus = require('./HttpStatus')

class Controller extends EventEmitter {
	constructor() {
		super()
	}

	invokeRender() {
		return async ctx => {
			const render = this.render
			if (!render) {
				ctx.body = `Missing render method in Controller!!!`
				ctx.status = 500
				return
			}
			await render.call(this, ctx)
		}
	}

	invokeAction(actionName) {
		const func = this[actionName]
		if (typeof func !== 'function') {
			throw new ReferenceError(`${actionName} action non-existent.`)
		}
		return async ctx => {
			ctx.controller = { ...this.options, actionName }
			const res = new Response()
			try {
				res.setStatus(httpStatus.Ok.status).setMessage('').setRetCode(0).setJson(null)
				await func.call(this, ctx, res)
				res.flush(ctx)
			} catch (e) {
				res.setStatus(httpStatus.ServerError.status).setMessage(httpStatus.ServerError.message).flush(ctx)
				ctx.app.emit('error', e)
			}
		}
	}
}

module.exports = Controller

module.exports.invokeRender = controller => {
	return new controller().invokeRender()
}
module.exports.invokeAction = (controller, method) => {
	return new controller().invokeAction(method)
}
