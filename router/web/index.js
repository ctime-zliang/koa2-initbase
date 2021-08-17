const routerExec = require('../../lib/router.exec')
const homeRoutes = require('./home')

module.exports = routerExec([...homeRoutes])
