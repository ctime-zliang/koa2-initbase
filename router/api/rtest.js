const HomeController = require('../../app/controller/home')

module.exports = [
	{
		desc: '测试 API',
		method: 'GET',
		path: '/rtest',
		action: HomeController.invokeAction('rtest'),
	},
]
