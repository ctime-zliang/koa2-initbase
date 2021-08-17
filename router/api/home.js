const HomeController = require('../../app/controller/home')

module.exports = [
	{
		desc: '测试 API',
		method: 'GET',
		path: '/rtest',
		action: HomeController.invokeAction('rtest'),
	},
	{
		desc: '测试 API',
		method: 'GET',
		path: '/a/123',
		action: ctx => {
			ctx.status = 200
			ctx.body = `/a/123`
		},
	},
	{
		desc: '测试 API',
		method: 'GET',
		path: '/a/:p',
		action: ctx => {
			ctx.status = 200
			ctx.body = `/a/:p`
		},
	},
]
