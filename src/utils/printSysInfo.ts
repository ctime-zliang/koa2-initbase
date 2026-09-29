import os from 'os'

const c = {
	reset: '\x1b[0m',
	bold: '\x1b[1m',
	dim: '\x1b[2m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	magenta: '\x1b[35m',
	gray: '\x1b[90m',
}

function formatUptime(seconds: number): string {
	const s: number = Math.floor(seconds)
	const d: number = Math.floor(s / 86400)
	const h: number = Math.floor((s % 86400) / 3600)
	const m: number = Math.floor((s % 3600) / 60)
	const sec: number = s % 60
	const parts: Array<string> = []
	if (d) {
		parts.push(`${d}d`)
	}
	if (h) {
		parts.push(`${h}h`)
	}
	if (m) {
		parts.push(`${m}m`)
	}
	parts.push(`${sec}s`)
	return parts.join(' ')
}

export function printSysInfo(): void {
	const rows: Array<[string, string]> = [
		['Computer Name', os.hostname()],
		['CPU Architecture', os.arch()],
		['User Name', os.userInfo().username],
		['User Root Directory', os.userInfo().homedir],
		['Temporary File Directory', os.tmpdir()],
		['OS Type', os.type()],
		['OS Platform', os.platform()],
		['OS Version', os.release()],
		['System Uptime', formatUptime(os.uptime())],
		['Total System Memory', `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)} GB`],
		['Free System Memory', `${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)} GB`],
	]
	const labelWidth: number = Math.max(
		...rows.map(([label]) => {
			return label.length
		})
	)
	const valueWidth: number = Math.max(
		...rows.map(([, value]) => {
			return value.length
		})
	)
	const innerWidth: number = labelWidth + valueWidth + 5
	const title: string = 'SYSTEM INFORMATION'
	const top: string = `${c.cyan}╔${'═'.repeat(innerWidth)}╗${c.reset}`
	const bottom: string = `${c.cyan}╚${'═'.repeat(innerWidth)}╝${c.reset}`
	const titlePadTotal: number = innerWidth - title.length
	const titlePadLeft: number = Math.floor(titlePadTotal / 2)
	const titlePadRight: number = titlePadTotal - titlePadLeft
	const titleLine: string =
		`${c.cyan}║${c.reset}` +
		' '.repeat(titlePadLeft) +
		`${c.bold}${c.magenta}${title}${c.reset}` +
		' '.repeat(titlePadRight) +
		`${c.cyan}║${c.reset}`
	const separator: string = `${c.cyan}╟${'─'.repeat(innerWidth)}╢${c.reset}`
	console.log('\n' + top)
	console.log(titleLine)
	console.log(separator)
	for (const [label, value] of rows) {
		const paddedLabel: string = label.padEnd(labelWidth)
		const paddedValue: string = value.padEnd(valueWidth)
		console.log(
			`${c.cyan}║${c.reset} ` +
				`${c.green}${paddedLabel}${c.reset} ` +
				`${c.gray}:${c.reset} ` +
				`${c.yellow}${paddedValue}${c.reset} ` +
				`${c.cyan}║${c.reset}`
		)
	}
	console.log(bottom + '\n')
}
