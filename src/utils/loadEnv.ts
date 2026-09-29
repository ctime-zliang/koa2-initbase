import fs from 'fs'
import path from 'path'

/**
 * 解析单个 .env 文本内容为键值对
 * 		- 忽略空行与以 # 开头的注释行
 * 		- 支持 KEY = VALUE / KEY=VALUE
 * 		- 去除值两端的成对引号
 */
function parseEnvContent(content: string): Record<string, any> {
	const result: Record<string, any> = {}
	const lines: Array<string> = content.split(/\r?\n/)
	for (const rawLine of lines) {
		const line: string = rawLine.trim()
		if (line === '' || line.startsWith('#')) {
			continue
		}
		const eqIndex: number = line.indexOf('=')
		if (eqIndex === -1) {
			continue
		}
		const key: string = line.slice(0, eqIndex).trim()
		if (key === '') {
			continue
		}
		let value: string = line.slice(eqIndex + 1).trim()
		/**
		 * 去除成对的首尾单双引号
		 */
		if (value.length >= 2 && ((value[0] === '"' && value[value.length - 1] === '"') || (value[0] === "'" && value[value.length - 1] === "'"))) {
			value = value.slice(1, -1)
		}
		result[key] = value
	}
	return result
}

function applyEnv(env: Record<string, any>): void {
	for (const key of Object.keys(env)) {
		if (process.env[key] === undefined) {
			process.env[key] = env[key]
		}
	}
}

function loadEnvFile(filePath: string): void {
	try {
		if (fs.existsSync(filePath)) {
			applyEnv(parseEnvContent(fs.readFileSync(filePath, 'utf-8')))
		}
	} catch {}
}

function normalizeRunMode(rawMode: string, defaultMode: string): string {
	const normalized: string = rawMode.trim().toLowerCase()
	if (normalized === '') {
		return defaultMode
	}
	return normalized
}

/**
 * 加载环境变量
 * 		- 先加载基础 .env
 * 		- 解析并归一化运行模式, 再加载对应的 .env.<mode>
 */
export function loadEnv(cwd: string = process.cwd(), defaultMode: string = 'development'): string {
	loadEnvFile(path.join(cwd, '.env'))
	const rawMode: string = process.env.RUN_MODE || process.env.NODE_ENV || defaultMode
	const mode: string = normalizeRunMode(rawMode, defaultMode)
	/**
	 * 同时尝试原始写法与归一化写法, 兼容 .env.PRODUCTION / .env.production 两种文件名
	 */
	loadEnvFile(path.join(cwd, `.env.${rawMode.trim()}`))
	if (rawMode.trim() !== mode) {
		loadEnvFile(path.join(cwd, `.env.${mode}`))
	}
	return mode
}
