document.addEventListener(`DOMContentLoaded`, function () {
	window
		.fetch('home/getAPITest', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		})
		.then(res => {
			uConsole(res)
			res.json().then(result => {
				uConsole(result)
			})
		})
	window
		.fetch('home/postAPITest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				tag: 'sk-1994',
			}),
		})
		.then(res => {
			uConsole(res)
			res.json().then(result => {
				uConsole(result)
			})
		})

	window
		.fetch('translation/baiduTranslation', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({
				sourceLang: 'ja-JP',
				items: [
					{
						id: 0,
						format: 'text',
						target: 'zh-CN',
						text: 'ロングスカート',
					},
					{
						id: 1,
						format: 'text',
						target: 'zh-CN',
						text: '制服',
					},
				],
			}),
		})
		.then(res => {
			uConsole(res)
			res.json().then(result => {
				uConsole(result)
			})
		})
})
