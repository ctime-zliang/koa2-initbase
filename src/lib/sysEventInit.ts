import events, { EventEmitter } from 'events'
import koa from 'koa'

export const sysEventEmitter: EventEmitter = new events.EventEmitter()

export function sysEventInit(app: koa): void {
	sysEventEmitter.on('system/server-start', (res: Record<string, any>): void => {
		if (res.error) {
			console.error(`[system/server-start] Failed to start server: `)
			console.error(res.error)
			return
		}
		console.warn(`[system/server-start] Server started at http://${res.hostname}:${res.port}`)
	})
	sysEventEmitter.on('system/server-stop', (res: Record<string, any>): void => {
		if (res.error) {
			console.error(`[system/server-stop] Error during server close: `)
			console.error(res.error)
			return
		}
		if (res.timeout) {
			console.error(`[system/server-stop] Forced shutdown after timeout (signal: ${res.signal})`)
			return
		}
		console.warn(`[system/server-stop] Server stopped (signal: ${res.signal})`)
	})
}
