const routerExec = require('../../lib/RouterExec')
const homeRoutes = require('./home')
const recordRoutes = require('./record')

module.exports = routerExec([...homeRoutes, ...recordRoutes])
