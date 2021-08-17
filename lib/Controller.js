const EventEmitter = require('events')
const Response = require('./Response')
const httpStatus = require('./httpStatus')

class Controller extends EventEmitter {
	constructor(options) {
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

	/**
	 * 代理执行某个 action
	 * @param {string} actionName action 的名字
	 * @return {function} (ctx, next) => {}
	 */
	invokeAction(actionName) {
		if (typeof this[actionName] !== 'function') {
			throw new ReferenceError(`${actionName} action non-existent.`)
		}
		return async ctx => {
			ctx.controller = { ...this.options, actionName }
			const func = this[actionName]
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
