import koa from 'koa'
import { AddressInfo } from 'net'
import { init } from './lib/init'
import { sysEventEmitter } from './lib/sysEventInit'
import { Server } from 'http'
import { serverConfig } from './config/config'

type TStartServerResult = {
	app: koa
	server: Server
	hostname: string
	port: number
}

function startServer(hostname: string, port: number): Promise<TStartServerResult> {
	const app: koa = new koa()
	init(app)
	return new Promise<TStartServerResult>((resolve, reject): void => {
		const server: Server = app.listen(port, hostname)
		server.once('error', (err: Error): void => {
			reject(err)
		})
		server.once('listening', (): void => {
			const addressInfo: AddressInfo | string | null = server.address()
			if (addressInfo && typeof addressInfo !== 'string') {
				resolve({ app, server, hostname: addressInfo.address, port: addressInfo.port })
				return
			}
			resolve({ app, server, hostname, port })
		})
	})
}

function serverShutdown(server: Server): void {
	let shuttingDown: boolean = false
	const shutdown = (signal: string): void => {
		if (shuttingDown) {
			return
		}
		shuttingDown = true
		const timer: NodeJS.Timeout = setTimeout((): void => {
			sysEventEmitter.emit('system/server-stop', {
				timeout: true,
				signal,
			})
			process.exit(1)
		}, 10000)
		timer.unref()
		server.close((err?: Error): void => {
			clearTimeout(timer)
			if (err) {
				sysEventEmitter.emit('system/server-stop', {
					error: err,
					signal,
				})
				process.exit(1)
			}
			sysEventEmitter.emit('system/server-stop', {
				signal,
			})
			process.exit(0)
		})
	}
	const SIGNALS: Array<string> = ['SIGTERM', 'SIGINT']
	for (const signal of SIGNALS) {
		process.on(signal, (): void => {
			shutdown(signal)
		})
	}
}

process.on('unhandledRejection', (reason: unknown): void => {
	console.error('UnhandledRejection:', reason)
})
process.on('uncaughtException', (err: Error): void => {
	console.error('UncaughtException:', err)
})

startServer(serverConfig.host, serverConfig.port)
	.then((res: TStartServerResult): void => {
		serverShutdown(res.server)
		sysEventEmitter.emit('system/server-start', {
			error: undefined,
			hostname: res.hostname,
			port: res.port,
		})
	})
	.catch((err: Error): void => {
		sysEventEmitter.emit('system/server-start', {
			error: err,
		})
		process.exit(1)
	})
