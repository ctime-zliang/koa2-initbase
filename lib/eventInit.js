const events = require('events')

const eventEmitter = new events.EventEmitter()

global.eventEmitter = eventEmitter

module.exports.eventInit = app => {
	eventEmitter.on('app/common', res => {
		console.log(res)
	})
}

module.exports.eventEmitter = eventEmitter
