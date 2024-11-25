const fs = require('fs')
const path = require('path')
const MIME = require('./mime')

const utils = {}

/**
 * 前置添 0
 * @param {number | string} value 待处理的值
 * @return {string} 处理后的值
 */
utils.padNumber = value => {
	return value > 9 ? String(value) : '0' + String(value)
}

/**
 * 格式化时间
 * @param {number} date 时间戳(时间对象)
 * @param {string} format 期望的格式
 * @return {string} 格式化的时间字符串
 */
utils.formatDates = (date = new Date(), format = 'yyyy-MM-dd HH:ii:ss') => {
	let o = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'H+': date.getHours(),
		'h+': date.getHours(),
		'i+': date.getMinutes(),
		's+': date.getSeconds(),
		'q+': Math.floor((date.getMonth() + 3) / 3),
		S: date.getMilliseconds(),
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for (let k in o) {
		if (new RegExp('(' + k + ')').test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
		}
	}
	return format
}

/**
 * 设置 cookie
 * @param {object} ctx KoaApp 实例对象
 * @param {string} key 设置的键名
 * @param {string} value 设置的键值
 * @param {object} option 可选的参数
 * @return {undefined}
 */
utils.setCookie = function (ctx, key, value, option) {
	ctx.cookies.set(key, value, { ...option })
}

/**
 * 获取 MIME 类型
 * @param {string} pathString 文件路径
 * @return {string | undefined} 文件的 MIME 类型
 */
utils.getMimeType = function (pathString) {
	let extName = path.extname(pathString)
	extName = extName ? extName.slice(1) : 'unknown'
	return MIME[extName]
}

/**
 * 获取文件基础名
 * @param {string} fileName 文件名
 * @return {string} 文件基础名
 */
utils.getSuffixName = function (fileName) {
	let analysis = fileName.split('.')
	return analysis.length >= 1 ? analysis[analysis.length - 1] : ''
}

/**
 * 获取静态资源内容
 * @param {object} ctx 执行上下文
 * @param {string} staticPath 静态资源的绝对路径
 * @return {string} 静态资源目录或者文件内容
 */
utils.ENUM_GET_STATIC_CONTENT = {
	STRING: 'string',
	FILE: 'file',
}
utils.getStaticContent = async function (ctx, staticPath) {
	const urlArr = ctx.url.split('?')
	const requestUrl = urlArr[0]
	const requestPath = path.join(staticPath, requestUrl)
	const res = { exist: false, content: null, type: undefined }
	if (!fs.existsSync(requestPath)) {
		res.exist = false
		res.type = this.ENUM_GET_STATIC_CONTENT.STRING
		res.content += `
			<h2 style="text-align: center; line-height: 100px;">404 Not Found</h2>
		`
		return res
	}
	const statSyncRes = fs.statSync(requestPath)
	if (statSyncRes.isDirectory()) {
		res.type = this.ENUM_GET_STATIC_CONTENT.STRING
		res.content = outputDirView(requestUrl, requestPath)
	} else {
		res.type = this.ENUM_GET_STATIC_CONTENT.FILE
		res.content = fs.readFileSync(requestPath, 'binary')
	}
	res.exist = true
	return res

	function outputDirView(url, path) {
		let html = `<ul>`
		for (let [index, item] of ergodicCatalogue(path).entries()) {
			html += `
				<li><a href="${url === '/' ? '' : url}/${item}">${item}</a></li>
			`
		}
		html += `</ul>`
		return html
	}
	function ergodicCatalogue(path) {
		const catalogues = fs.readdirSync(path)
		const dirList = []
		const fileList = []
		for (let i = 0; i < catalogues.length; i++) {
			const splitArr = catalogues[i].split('.')
			const itemMIME = splitArr.length > 1 ? splitArr[splitArr.length - 1] : 'undefined'
			if (typeof MIME[itemMIME] === 'undefined') {
				dirList.push(catalogues[i])
			} else {
				fileList.push(catalogues[i])
			}
		}
		return dirList.concat(fileList)
	}
}

/**
 * 序列化 URL
 * @param {string} url 需要解析的 URL
 * @return {object} 序列化的哈希结果
 */
utils.parseUrl = function (url) {
	const urlObj = {
		/* eslint-disable */
		protocol: /^(.+)\:\/\//i,
		host: /\:\/\/(.+?)[\?\#\s\/]/i,
		path: /\w(\/.*?)[\?\#\s]/i,
		query: /\?(.+?)[\#\/\s]/i,
		hash: /\#(\w+)\s$/i,
		/* eslint-disable */
	}
	url += ' '
	function formatQuery(str) {
		return str.split('&').reduce((a, b) => {
			let arr = b.split('=')
			a[arr[0]] = arr[1]
			return a
		}, {})
	}
	for (let key in urlObj) {
		let pattern = urlObj[key]
		urlObj[key] = key === 'query' ? pattern.exec(url) && formatQuery(pattern.exec(url)[1]) : pattern.exec(url) && pattern.exec(url)[1]
	}
	return urlObj
}

/**
 * cookie 操作
 */
utils.cookie = {
	set(ctx, key, value, options = {}) {
		const opt = {
			httpOnly: false,
			...options,
		}
		ctx.cookies.set(key, value, opt)
	},
	get(ctx, key) {
		return ctx.cookies.get(key)
	},
}

module.exports = utils
