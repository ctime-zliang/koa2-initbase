import { TKoaContextExtend } from '../types/services'

function hasHttpStatus(error: any): boolean {
	if (!error || typeof error !== 'object') {
		return false
	}
	return typeof error.status === 'number' || typeof error.statusCode === 'number'
}

export function handleError(error: any, ctx?: TKoaContextExtend): string {
	const list: Array<string> = []
	const err: any = error instanceof Error || (error && typeof error === 'object') ? error : new Error(String(error))
	if (hasHttpStatus(err)) {
		list.push(`=>>[status] ${err.status ?? err.statusCode}`)
	}
	if (ctx) {
		list.push(`=>>[request] ${ctx.method} ${ctx.url}`)
	}
	if (typeof err.message === 'string' && err.message !== '') {
		list.push(`=>>[message] ${err.message}`)
	}
	for (const key of Object.keys(err)) {
		if (key === 'message' || key === 'stack') {
			continue
		}
		if (typeof err[key] === 'string') {
			list.push(`=>>[${key}] ${err[key]}`)
		}
	}
	if (err.stack) {
		list.push(`=>>[stack] ${err.stack}`)
	}
	return list.join('\r\n')
}
