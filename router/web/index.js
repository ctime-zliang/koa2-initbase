const routerInit = require('../../lib/routerInit')
const homeRoutes = require('./home')

module.exports = routerInit([...homeRoutes])
