import koa from 'koa'
import { middleware } from '../middleware'
import { koaAppEventInit } from './koaAppEventInit'
import { sysEventInit } from './sysEventInit'
import { printSysInfo } from '../utils/printSysInfo'
import { koaPageView } from './koaPageView'

export function init(app: koa): void {
	sysEventInit(app)
	koaAppEventInit(app)
	koaPageView(app)
	middleware(app)
	printSysInfo()
}
