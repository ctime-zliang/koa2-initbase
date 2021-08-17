const routerExec = require('../../lib/router.exec')
const homeRoutes = require('./home')
const recordRoutes = require('./record')

module.exports = routerExec([...homeRoutes, ...recordRoutes])
