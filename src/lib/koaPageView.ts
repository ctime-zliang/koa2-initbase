import koa from 'koa'
import koaEjs from 'koa-ejs'
import { viewConfig } from '../config/config'

export function koaPageView(app: koa): void {
	koaEjs(app, {
		root: viewConfig.templateRoot,
		layout: viewConfig.layout,
		viewExt: viewConfig.viewExt,
		cache: viewConfig.cache,
		debug: false,
	})
}
