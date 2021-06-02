const mysql = require('mysql')
const SQL = require('./SQL')

const resultsHandle = {
	/**
	 * 获取列表数据的第一项
	 * 针对 select 语句单条数据使用
	 * @param {object} res {results,fields} 通过 query 返回的数据
	 * @return {object|null} 有则返回对象数据，没有则返回null
	 */
	one(res) {
		return Array.isArray(res.results) && res.results.length > 0 ? res.results[0] : null
	},

	/**
	 * 返回所有的列表数据
	 * @param {object} res {results,fields}
	 * @returns {array}
	 */
	all(res) {
		return Array.isArray(res.results) ? res.results : []
	},

	/**
	 * 返回更新的行数
	 * @param {object} res  {results,fields} 通过 query 返回的数据
	 * @return {number}
	 */
	updates(res) {
		return res.results && res.results.affectedRows ? res.results.affectedRows : 0
	},
	/**
	 * 获取插入数据的insertId
	 * @param {object} res {results,fields} 通过 query 返回的数据
	 * @return {number}
	 */
	insertId(res) {
		return res.results && res.results.insertId ? res.results.insertId : 0
	},

	/**
	 * 针对 toQueryTotal 转化的sql返回的
	 * @param {object} res {results,fields} 通过 query 返回的数据
	 * @return {number}
	 */
	total(res) {
		return Array.isArray(res.results) && res.results.length > 0 ? res.results[0].total : 0
	},
}

class Mysql {
	constructor(sqlProfile, table, primaryKey = 'id') {
		this.sqlProfile = sqlProfile
		this.table = table
		this.connection = null
		this.sql = SQL
		this.isConnected = false
		this.resultsHandle = resultsHandle
		this.primaryKey = primaryKey
	}

	connect(callback) {
		if (this.isConnected == true) {
			callback && callback(this.connection)
			return
		}
		this.connection = mysql.createConnection(this.sqlProfile)
		this.connection.connect(error => {
			if (error) {
				this.handleError(error)
				// throw err
			}
			this.isConnected = true
			callback && callback(this.connection)
		})
		this.connection.on('error', error => {
			this.handleError(error)
			this.isConnected = false
		})
		return this
	}

	/**
	 * 将 sql 语句解析完整
	 * @param {string} sql 语句
	 * @param {object|array} params 参数
	 * @return {string}
	 */
	sqlFormat(...args) {
		return mysql.format(...args)
	}

	/**
	 * 默认格式化results列表数据
	 * @param {object} res {results, fields} 通过 query 获取返回的数据
	 * @param {object}
	 */
	formatResult(res) {
		let results = null
		let fields = {}
		if (Array.isArray(res.results) && res.results.length > 0) {
			results = []
			res.results.forEach((item, index) => {
				results.push(item)
			})
		}
		if (typeof res.results == 'object') {
			results = res.results
		}
		return { results, fields: res.fields }
	}

	/**
	 * 事物操作
	 * @param {array} sqlList 要执行事物的 mysql 处理函数
	 */
	async transaction(sqlList) {
		return new Promise(async (resolve, reject) => {
			this.connect(connection => {
				connection.beginTransaction(async error => {
					if (error) {
						reject(this.handleError(error))
						return
					}
					let res = []
					for (let sql of sqlList) {
						try {
							res.push(await this.query(sql))
						} catch (error) {
							connection.rollback(() => {
								reject(this.handleError(error))
							})
							return
						}
					}
					connection.commit(error => {
						if (error) {
							connection.rollback(() => {
								reject(this.handleError(error))
							})
						}
						resolve(res)
					})
				})
			})
		})
	}

	/**
	 * 执行 sql 语句
	 * @param {string} sql 执行 sql 语句
	 * @return {object} {results, fields}
	 */
	async query(sql) {
		return new Promise((resolve, reject) => {
			this.connect(connection => {
				connection.query(sql, (error, results, fields) => {
					if (error) {
						error.sqlMessage += `[sql:${error.sql}][srcSQL:${sql}]`
						reject(this.handleError(error))
						return
					}
					resolve(this.formatResult({ results, fields }))
				})
			})
		})
	}

	handleError(message) {
		const strObj = {}
		if (typeof message == 'object') {
			const fields = Object.getOwnPropertyNames(message)
			fields.forEach(field => {
				strObj[field] = message[field]
			})
		} else {
			strObj['message'] = message
		}
		return {
			...strObj,
		}
	}
}

module.exports = Mysql
