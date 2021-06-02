const HomeController = require('../../app/controller/home')

module.exports = [
	{
		desc: 'Home Page',
		method: 'GET',
		path: '/',
		action: HomeController.invokeView('render'),
	},
]
