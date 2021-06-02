class Service {
	constructor() {}

	/**
	 * 代理执行某个 service
	 * @param {string} serviceName service 的名字
	 * @return {any}
	 */
	async invokeService(serviceName, ...args) {
		try {
			return await this[serviceName].call(this, ...args)
		} catch (error) {
			throw error
		}
	}
}

module.exports = Service
