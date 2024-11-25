const commonStatus = require('../../lib/resStatus')

module.exports = {
	controller: {
		...commonStatus.controller,
		NO_ID: {
			msg: `缺少 ID`,
			ret: -10001,
		},
	},
	service: {
		...commonStatus.service,
	},
}
