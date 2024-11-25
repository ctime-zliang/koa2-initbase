const isErrorWithStatus = error => {
	if (typeof error['status'] == 'number' && error['error'] && error['error']['stack']) {
		return true
	}
	return false
}

const handleError = error => {
	const list = []
	const statusError = isErrorWithStatus(error)
	const err = statusError ? error.error : error
	if (statusError) {
		list.push(`=>>[status]${err.status}`)
	}
	for (let key in err) {
		if (typeof err[key] == 'string') {
			list.push(`=>>[${key}]${err[key]}`)
		}
	}
	list.push(`=>>[stack]${err.stack}`)
	return list.join('\r\n')
}

module.exports = (error, ctx) => {
	return handleError(error)
}
