const { invokeRender } = require('../../lib/Controller')
const HomeController = require('../../app/controller/home')

module.exports = [
	{
		desc: 'Home Page',
		method: 'GET',
		path: '/',
		// action: HomeController.invokeRender('render'),
		action: invokeRender(HomeController),
	},
]
