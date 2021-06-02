const routerExec = require('../../lib/router.exec')
const homeRoutes = require('./home')
const recordRoutes = require('./record')

const routes = [...homeRoutes, ...recordRoutes]

module.exports = routerExec(routes)
