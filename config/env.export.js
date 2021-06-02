const devCfg = require('./env-config/development.config')
const preCfg = require('./env-config/prerelease.config')
const proCfg = require('./env-config/production.config')

const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
	development: devCfg,
	prerelease: preCfg,
	production: proCfg,
}[NODE_ENV]
