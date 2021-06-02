const EventEmitter = require('events')
const Response = require('./Response')
const httpStatus = require('./httpStatus')

const defaultOptions = {
	controllerName: 'controller',
}
class Controller extends EventEmitter {
	constructor(options) {
		super()
		this.options = {
			...defaultOptions,
			...options,
		}
	}

	_decorator(fn) {
		return async ctx => {
			const res = new Response()
			/* 设置 Res 的初始状态 */
			res.setStatus(httpStatus.Ok.status).setMessage('').setRetCode(0).setData(null)
			await fn.call(this, ctx, res)
			return res
		}
	}

	/**
	 * 代理执行某个 action
	 * @param {string} actionName action 的名字
	 * @return {function} (ctx, next) => {}
	 */
	invokeAction(actionName) {
		if (typeof this[actionName] !== 'function') {
			throw new ReferenceError(`${this.options.controllerName} ${actionName} action non-existent`)
		}
		return async ctx => {
			ctx.controller = {
				...this.options,
				actionName,
			}
			const func = this[actionName]
			try {
				const res = await this._decorator(func).call(this, ctx)
				res.flush(ctx)
			} catch (e) {
				const res = new Response()
				res.setStatus(httpStatus.ServerError.status).setMessage(httpStatus.ServerError.message).flush(ctx)
				ctx.app.emit('error', e)
			}
		}
	}

	/**
	 * 代理执行某个 view
	 * @param {string} actionName action 的名字
	 * @return {function} (ctx, next) => {}
	 */
	invokeView(actionName) {
		if (typeof this[actionName] !== 'function') {
			throw new ReferenceError(`${this.options.controllerName} ${actionName} action non-existent`)
		}
		return async ctx => {
			ctx.controller = {
				...this.options,
				actionName,
			}
			const func = this[actionName]
			try {
				await func.call(this, ctx)
			} catch (e) {
				const res = new Response()
				res.setStatus(httpStatus.ServerError.status).setMessage(httpStatus.ServerError.message).flush(ctx)
				ctx.app.emit('error', e)
			}
		}
	}
}

module.exports = Controller
