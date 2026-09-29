import fs from 'fs'
import { normalize, basename, resolve, parse } from 'path'
import type koa from 'koa'
import { HttpError } from '../utils/HttpError'
import { decode, exists, fileType, isHidden, resolveSafePath } from '../utils/fileSystem'
import { httpStatus } from '../utils/HttpStatus'

/**
 * 源码根目录(通常指 ./src)
 * 		以当前文件位置为基准
 */
const SOURCE_ROOT: string = resolve(__dirname, '..')

/**
 * 静态资源服务选项
 */
type TKoaStaticOptions = {
	/**
	 * 浏览器缓存 max-age (ms)
	 *      默认: 0
	 */
	maxage?: number
	/**
	 * maxage 的别名
	 */
	maxAge?: number
	/**
	 * 是否在 Cache-Control 中追加 immutable 指令
	 *      默认: false
	 */
	immutable?: boolean
	/**
	 * 是否允许访问隐藏文件 (以 "." 开头)
	 *      默认: false
	 */
	hidden?: boolean
	/**
	 * 目录默认索引文件, 设置 false 关闭
	 *      默认: 'index.html'
	 */
	index?: string | false
	/**
	 * 是否将 /directory 补全为 /directory/index
	 *      默认: true
	 */
	format?: boolean
	/**
	 * 无扩展名请求时尝试补全的扩展名列表
	 */
	extensions?: Array<string> | false
	/**
	 * 是否优先返回 .br 预压缩文件
	 *      默认: true
	 */
	brotli?: boolean
	/**
	 * 是否优先返回 .gz 预压缩文件
	 *      默认: true
	 */
	gzip?: boolean
	/**
	 * 命中后置于 next() 之后处理(让其他中间件优先)
	 *      默认: false
	 */
	defer?: boolean
	/**
	 * 自定义响应头钩子
	 */
	setHeaders?: (res: koa.Context['res'], path: string, stats: fs.Stats) => void
}

/**
 * koaStatic 的配置式入参
 *
 * 相比直接传入绝对路径 root, 这里通过 path 声明一个"相对源码根目录"的静态资源目录, 由模块内部自动解析成绝对路径
 *      示例: { path: '/app/view/static' } -> 解析为 <src|dist>/app/view/static
 */
type TKoaStaticConfig = TKoaStaticOptions & {
	/**
	 * 静态资源目录, 相对源码根目录; 开头的 "/" 可有可无, 均视为相对源码根目录
	 *      示例: '/app/view/static' 或 'app/view/static'
	 */
	path: string
	/**
	 * 解析 `path` 时使用的基准目录
	 *      默认: 源码根目录
	 */
	base?: string
}

type TSendOptions = TKoaStaticConfig & {
	root: string
}

/**
 * 将请求路径解析为磁盘上的物理文件, 并把文件流写入响应
 *
 * 		输入:
 * 			ctx: Koa 上下文
 * 			inputPath: 请求路径(通常为 ctx.path)
 * 			opts: 发送选项, 其中 root 为已解析的静态资源根目录
 * 		输出:
 * 			- 命中并成功发送时: 返回最终文件的绝对路径
 * 			- 未命中: 返回 undefined
 */
async function send(ctx: koa.Context, inputPath: string, opts: TSendOptions): Promise<string | undefined> {
	/**
	 * 将配置的 root 解析为绝对路径
	 */
	const root: string = opts.root ? normalize(resolve(opts.root)) : ''
	/**
	 * 判断输入的相对路径是否以 "/" 结尾, 即用于判断是否需要补全默认索引文件(通常为 index)
	 */
	const trailingSlash: boolean = inputPath[inputPath.length - 1] === '/'
	/**
	 * 移除输入路径的前缀 (POSIX 下为 "/", NT 平台下可能为 "C:\")
	 */
	let path: string = inputPath.slice(parse(inputPath).root.length)
	/**
	 * 获取默认索引文件名(可能为 "index.html"); 传入 false 表示关闭
	 */
	const index: string | boolean = opts.index!
	const maxage: number = opts.maxage || opts.maxAge || 0
	/**
	 * 选项: 在 Cache-Control 中追加 immutable 指令
	 */
	const immutable: boolean = opts.immutable || false
	/**
	 * 选项: 允许访问隐藏文件(以 "." 开头)
	 */
	const hidden: boolean = opts.hidden || false
	/**
	 * 选项: 将目录请求补全为 /directory/index
	 */
	const format: boolean = opts.format !== false
	/**
	 * 选项: 无扩展名请求时尝试补全的扩展名列表, 非数组时退化为 false
	 */
	const extensions: Array<string> | boolean = Array.isArray(opts.extensions) ? opts.extensions : false
	/**
	 * 选项: 优先返回 .br 预压缩文件
	 */
	const brotli: boolean = opts.brotli !== false
	/**
	 * 选项: 优先返回 .gz 预压缩文件
	 */
	const gzip: boolean = opts.gzip !== false
	const setHeaders = opts.setHeaders
	if (setHeaders && typeof setHeaders !== 'function') {
		throw new TypeError('option setHeaders must be function')
	}
	/**
	 * 解码 URL
	 * 		即类似于 "%20" 的编码字符串, 解析成可识别的字符串
	 */
	const decoded: string | null = decode(path)
	if (decoded === null) {
		return ctx.throw(httpStatus.BadRequest.status, `[${httpStatus.BadRequest.message()}]: failed to decode`)
	}
	path = decoded
	/**
	 * 请求路径以 "/" 结尾, 且已配置了索引文件名称时, 将索引文件名称添加至输入(已处理过的)路径后面
	 */
	if (index && trailingSlash) {
		path += index
	}
	/**
	 * 拼接为安全的绝对路径, 避免形如 "../" 跳出目录
	 */
	path = resolveSafePath(root, path)
	/**
	 * 未开放隐藏文件访问时, 命中隐藏文件, 视为未命中任何文件
	 */
	if (!hidden && isHidden(root, path)) {
		return
	}
	let encodingExt: string = ''
	/**
	 * 预压缩协商
	 * 		客户端接受 br + 开启 brotli + 磁盘存在 .br 文件时, 优先返回 .br
	 */
	if (ctx.acceptsEncodings('br', 'identity') === 'br' && brotli && (await exists(path + '.br'))) {
		path = path + '.br'
		ctx.set('Content-Encoding', 'br')
		ctx.res.removeHeader('Content-Length')
		encodingExt = '.br'
	}
	/**
	 * 预压缩协商
	 * 		客户端接受 gzip + 开启 gzip + 磁盘存在 .gzip 文件时, 次选返回 .gzip
	 */
	else if (ctx.acceptsEncodings('gzip', 'identity') === 'gzip' && gzip && (await exists(path + '.gz'))) {
		path = path + '.gz'
		ctx.set('Content-Encoding', 'gzip')
		ctx.res.removeHeader('Content-Length')
		encodingExt = '.gz'
	}
	if (extensions && !/\./.exec(basename(path))) {
		for (let ext of extensions) {
			if (typeof ext !== 'string') {
				throw new TypeError('option extensions must be array of strings or false')
			}
			/**
			 * 检查文件后缀名是否包含 ".", 并补充之
			 */
			if (!/^\./.exec(ext)) {
				ext = `.${ext}`
			}
			/**
			 * 记录首个命中的文件
			 */
			if (await exists(`${path}${ext}`)) {
				path = `${path}${ext}`
				break
			}
		}
	}
	let stats: fs.Stats
	try {
		stats = await fs.promises.stat(path)
		/**
		 * 命中目录
		 */
		if (stats.isDirectory()) {
			if (format && index) {
				/**
				 * 读取索引文件
				 */
				path += `/${index}`
				stats = await fs.promises.stat(path)
			} else {
				return
			}
		}
	} catch (err) {
		/**
		 * 定义 404 错误范围:
		 * 		- ENOENT: 不存在
		 * 		- ENAMETOOLONG: 路径过长
		 * 		- ENOTDIR: 把文件当目录访问
		 */
		const notfound: Array<string> = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR']
		const code: string = (err as NodeJS.ErrnoException).code!
		if (code && notfound.includes(code)) {
			throw new HttpError(httpStatus.NotFound.status, (err as Error).message)
		}
		/**
		 * 500 错误
		 */
		;(err as HttpError).status = httpStatus.ServerError.status
		throw err
	}
	if (setHeaders) {
		setHeaders(ctx.res, path, stats)
	}
	/**
	 * 重新设置 Content-Length, 以文件本身大小更新
	 */
	ctx.set('Content-Length', String(stats.size))
	if (!ctx.response.get('Last-Modified')) {
		ctx.set('Last-Modified', stats.mtime.toUTCString())
	}
	if (!ctx.response.get('Cache-Control')) {
		/**
		 * 将设置的 maxAge 写入到 Cache-Control
		 * 		做 ms 到 s 的转换
		 */
		const directives: Array<string> = [`max-age=${(maxage / 1000) | 0}`]
		if (immutable) {
			/**
			 * immutable 告知浏览器缓存期内无需重新验证
			 */
			directives.push('immutable')
		}
		ctx.set('Cache-Control', directives.join(','))
	}
	/**
	 * 更新 Content-Type
	 */
	if (!ctx.type) {
		ctx.type = fileType(path, encodingExt)
	}
	/**
	 * 以文件流的形式写入响应体, 由 koa 自动 pipe
	 */
	ctx.body = fs.createReadStream(path)
	return path
}

/**
 * 将配置式入参解析为绝对根目录
 * 		path 视为相对 base (默认源码根目录) 的路径, 开头的 "/" 会被忽略
 */
function resolveConfigRoot(config: TKoaStaticConfig): string {
	const base: string = config.base ? resolve(config.base) : SOURCE_ROOT
	const relative: string = config.path.replace(/^[/\\]+/, '')
	return resolve(base, relative)
}

/**
 * 从静态资源目录提供文件服务
 *      - 默认命中即写入响应; rootOrConfig.defer 为 true 时置于 next() 之后处理
 *      - 仅处理 GET / HEAD 请求
 *      - 404 会放行给后续中间件, 其他错误照常抛出
 */
export function koaStatic(config: TKoaStaticConfig): koa.Middleware {
	if (!config || !config.path) {
		throw new Error('[system/koaStatic] option "path" is required to serve files')
	}
	const root: string = resolveConfigRoot(config)
	const options: TSendOptions = { ...config, root, path: config.path }
	if (options.index !== false) {
		options.index = options.index || 'index.html'
	}
	if (!options.defer) {
		return async function (ctx: koa.Context, next: koa.Next): Promise<void> {
			let done: string | undefined
			if (ctx.method === 'HEAD' || ctx.method === 'GET') {
				try {
					done = await send(ctx, ctx.path, options)
				} catch (err) {
					if ((err as HttpError).status !== httpStatus.NotFound.status) {
						throw err
					}
				}
			}
			if (!done) {
				await next()
			}
		}
	}
	return async function (ctx: koa.Context, next: koa.Next): Promise<void> {
		await next()
		if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
			return
		}
		if (ctx.body != null || ctx.status !== httpStatus.NotFound.status) {
			return
		}
		try {
			await send(ctx, ctx.path, options)
		} catch (err) {
			if ((err as HttpError).status !== httpStatus.NotFound.status) {
				throw err
			}
		}
	}
}
