const HomeController = require('../../app/controller/home')

module.exports = [
	{
		desc: '测试 API',
		method: 'GET',
		path: '/rtest',
		async before(ctx) {
			/* before hook */
			return true
		},
		async after(ctx) {
			/* after hook */
		},
		action: HomeController.invokeAction('rtest'),
	},	
	{
		desc: '测试 API',
		method: 'GET',
		path: '/a/:p',
		action: ctx => {
			console.log(`=== Route: /a/:p`)
			ctx.status = 200
			ctx.body = `/a/:p`
		},
	},
	{
		desc: '测试 API',
		method: 'GET',
		path: '/a/123',
		action: ctx => {
			console.log(`=== Route: /a/123`)
			ctx.status = 200
			ctx.body = `/a/123`
		},
	},
	{
		desc: '测试 API',
		method: 'GET',
		path: '/b/:p',
		action: ctx => {
			console.log(`=== Route: /b/:p`)
			ctx.status = 200
			ctx.body = `/b/:p`
		},
	},
]
