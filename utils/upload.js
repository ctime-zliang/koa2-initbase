const fs = require('fs')
const path = require('path')
const busBoy = require('busboy')

const getSuffixName = fileName => {
	let analysis = fileName.split('.')
	return analysis.length >= 1 ? analysis[analysis.length - 1] : ''
}

module.exports = async function uploadFile(ctx, { fileClassify = 'common', uploadPath = __dirname }) {
	const req = ctx.req
	const res = ctx.res
	uploadPath = path.join(uploadPath, fileClassify)
	if (!fs.existsSync(uploadPath)) {
		fs.mkdirSync(uploadPath)
	}

	return new Promise((resolve, reject) => {
		let busboy = null
		let result = {
			ret: -1,
			msg: '',
			data: {
				uploadField: {},
				uploadFilen: {},
			},
		}
		try {
			busboy = new busBoy({
				headers: req.headers,
			})
		} catch (e) {
			reject(e)
			return
		}

		busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
			const confusionFileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(fileName)
			const uploadFilePath = path.join(uploadPath, confusionFileName)

			result.data.uploadFilen['fieldName'] = fieldName
			result.data.uploadFilen['fileName'] = fileName
			result.data.uploadFilen['encoding'] = encoding
			result.data.uploadFilen['mimeType'] = mimeType
			result.data.uploadFilen['file'] = file
			file.pipe(fs.createWriteStream(uploadFilePath))
		})
		busboy.on('field', (fieldName, fieldValue, fieldnameTruncated, valTruncated, encoding, mimeType) => {
			result.data.uploadField[fieldName] = String(fieldValue)
		})
		busboy.on('finish', () => {
			console.log('Finish Upload...')
			result = {
				...result,
				ret: 0,
			}
			resolve(result)
		})
		busboy.on('error', (...args) => {
			console.log('Upload Error...')
			console.log(args)
			reject(result)
		})
		busboy.on('end', () => {
			console.log('Upload End...')
			result = {
				...result,
				ret: 0,
			}
			resolve(result)
		})
		req.pipe(busboy)
	})
}
