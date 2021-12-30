const mysql = require('mysql')

class SQL {
	constructor() {
		this.sql = []
	}

	select(fields = '*') {
		this.sql.push(`SELECT ${fields}`)
		return this
	}

	del(table = null) {
		this.sql.push(`DELETE from ${table}`)
		return this
	}

	insert(table = null) {
		this.sql.push(`INSERT INTO ${table}`)
		return this
	}

	update(table = null) {
		this.sql.push(`UPDATE ${table}`)
		return this
	}

	set(data) {
		if (typeof data == 'function') {
			data = data()
		}
		this.sql.push(mysql.format(`SET ?`, data))
		return this
	}

	from(table = null) {
		this.sql.push(`FROM ${table}`)
		return this
	}

	where(rules = {}, logic = 'AND', equal = '=') {
		logic = ` ${logic} `
		const arr = []
		let likeTag = equal === 'LIKE' ? '%' : ''
		for (let i in rules) {
			// 主要针对 a.field 的情况，如果加了 `` 可能会报错
			if (i.indexOf('.') > -1) {
				arr.push(mysql.format(`${i} ${equal} ?`, `${likeTag}${[rules[i]]}${likeTag}`))
				continue
			}
			arr.push(mysql.format(`\`${i}\` ${equal} ?`, `${likeTag}${[rules[i]]}${likeTag}`))
		}
		this.sql.push(`WHERE ${arr.join(logic)}`)
		return this
	}

	whereLike(rules = {}, logic = 'OR') {
		return this.where(rules, 'OR', 'LIKE')
	}

	whereIn(key, values) {
		const plac = []
		if (!Array.isArray(values)) {
			values = [values.toString()]
		}
		for (let i in values) {
			plac.push('?')
		}
		this.sql.push(mysql.format(`WHERE ${key} IN (${plac.join(',')}) `, values))
		return this
	}

	page(pageIndex, pageSize) {
		this.sql.push(`LIMIT ${pageSize} OFFSET ${(pageIndex - 1) * pageSize}`)
		return this
	}

	sort(orderby, desc = true) {
		this.sql.push(`ORDER BY ${orderby} ${desc ? 'DESC' : ''}`)
		return this
	}

	leftJoin(table, on) {
		this.sql.push(`LEFT JOIN ${table}`)
		return this
	}

	/**
	 * @example
	 *  on([{
	 *     leftKey,
	 *     rightKey,
	 *     equal
	 *  }], equal)
	 */
	on(keys, equal = 'AND') {
		const arr = []
		keys.forEach((item, index) => {
			arr.push(`${item.leftKey} ${item.equal ? item.equal : '='} ${item.rightKey}`)
		})
		this.sql.push(`ON ${arr.join(equal)}`)
		return this
	}

	orderBy() {
		return this
	}

	toString() {
		return this.sql.join(' ')
	}
}

module.exports = () => {
	return new SQL()
}
