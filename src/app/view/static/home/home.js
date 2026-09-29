document.addEventListener(`DOMContentLoaded`, function () {
	window
		.fetch('/getAPITest', {
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
		.fetch('/postAPITest', {
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
})
