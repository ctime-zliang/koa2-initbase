const routerExec = require('../../lib/RouterExec')
const homeRoutes = require('./home')

module.exports = routerExec([...homeRoutes])
