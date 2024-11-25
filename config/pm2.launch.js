const pm2 = require('pm2')
const path = require('path')

const appName = require(`App Server`)

pm2.connect(function (err) {
	if (err) {
		console.error(err)
		process.exit(2)
	}
	pm2.start(
		{
			script: path.join(__dirname, `../app.js`),
			output: path.join(__dirname, `../logs/${appName}_out.log`),
			error: path.join(__dirname, `../logs/${appName}_err.log`),
		},
		function (err, apps) {
			pm2.disconnect()
			pm2.launchBus(function (err, bus) {
				bus.on('log:PM2', log => {
					console.log(log)
				})
				bus.on('log:err', log => {
					console.error(log)
				})
				bus.on('log:out', log => {
					console.log(log)
				})
				bus.on('process:exception', log => {
					const errStack = log.data.stack || log.data
					console.log(log)
				})
			})
			if (err) {
				throw err
			}
		}
	)
})
