const RtestController = require('../../app/controller/record')

const prefixUrl = `/record`

module.exports = [
	{
		desc: '获取列表',
		method: 'GET',
		path: `${prefixUrl}/list`,
		action: RtestController.invokeAction('fetchList'),
	},
	{
		desc: '添加单项',
		method: 'POST',
		path: `${prefixUrl}/add`,
		action: RtestController.invokeAction('addItem'),
	},
	{
		desc: '删除多项',
		method: 'POST',
		path: `${prefixUrl}/dels`,
		action: RtestController.invokeAction('delItems'),
	},
	{
		desc: '获取单项',
		method: 'POST',
		path: `${prefixUrl}/item`,
		action: RtestController.invokeAction('fetchItem'),
	},
	{
		desc: '更新单项',
		method: 'POST',
		path: `${prefixUrl}/update`,
		action: RtestController.invokeAction('updateItem'),
	},
]
