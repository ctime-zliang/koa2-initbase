const routerExec = require('../../lib/router.exec')
const homeRoutes = require('./home')

const routes = [...homeRoutes]

module.exports = routerExec(routes)
