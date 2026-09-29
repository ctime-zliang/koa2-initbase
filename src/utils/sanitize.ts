const HTML_ESCAPE_MAP: Record<string, any> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;',
}

export function escapeHtml(input: string): string {
	return input.replace(/[&<>"'`=/]/g, (ch: string): string => {
		return HTML_ESCAPE_MAP[ch] || ch
	})
}

export function sanitizeDeep<T>(value: T): T {
	if (typeof value === 'string') {
		return escapeHtml(value) as unknown as T
	}
	if (Array.isArray(value)) {
		return value.map((item: unknown): unknown => {
			return sanitizeDeep(item)
		}) as unknown as T
	}
	if (value !== null && typeof value === 'object') {
		const result: Record<string, any> = {}
		for (const key of Object.keys(value as Record<string, any>)) {
			result[key] = sanitizeDeep((value as Record<string, any>)[key])
		}
		return result as unknown as T
	}
	return value
}
