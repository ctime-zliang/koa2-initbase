export function getEnvValue(key: string, fallback: string): string {
	const value: string | undefined = process.env[key]
	return value === undefined || value === '' ? fallback : value
}

export function getEnvNumberValue(key: string, fallback: number): number {
	const value: string | undefined = process.env[key]
	if (value === undefined || value.trim() === '') {
		return fallback
	}
	const parsed: number = Number(value)
	return Number.isFinite(parsed) ? parsed : fallback
}

export function getEnvBoolValue(key: string, fallback: boolean): boolean {
	const value: string | undefined = process.env[key]
	if (value === undefined || value.trim() === '') {
		return fallback
	}
	return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase())
}

export function getEnvStringList(key: string, fallback: Array<string>): Array<string> {
	const value: string | undefined = process.env[key]
	if (value === undefined || value.trim() === '') {
		return fallback
	}
	return value
		.split(',')
		.map((item: string): string => {
			return item.trim()
		})
		.filter((item: string): boolean => {
			return item !== ''
		})
}
