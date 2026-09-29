import koa from 'koa'
import zlib from 'zlib'
import { promisify } from 'util'
import { Stream, Readable } from 'stream'
import { TKoaContextExtend } from '../types/services'
import { httpStatus } from '../utils/HttpStatus'

type TCompressOptions = {
	/**
	 * 压缩下限阈值
	 */
	threshold?: number
	/**
	 * Brotli 压缩质量 (0 - 11)
	 * 动态内容默认取较低档以平衡 CPU 与压缩率
	 */
	brotliQuality?: number
	/**
	 * 流式压缩上限阈值(字节)
	 * 		默认 512KB
	 * 响应体为 Buffer/string 且大小 >= 该阈值时, 改用流式压缩, 避免一次性同步压缩超大内容造成事件循环阻塞与 CPU 峰值
	 */
	streamThreshold?: number
}

const gzipAsync: (buf: zlib.InputType, options: zlib.ZlibOptions) => Promise<Buffer> = promisify(zlib.gzip)
const deflateAsync: (buf: zlib.InputType, options: zlib.ZlibOptions) => Promise<Buffer> = promisify(zlib.deflate)
const brotliAsync: (buf: zlib.InputType, options: zlib.BrotliOptions) => Promise<Buffer> = promisify(zlib.brotliCompress)

/**
 * 判断内容类型是否需要压缩
 */
function isCompressibleType(type: string | undefined): boolean {
	if (!type) {
		return false
	}
	return /(?:text\/|application\/(?:json|javascript|xml|.*\+json|.*\+xml)|image\/svg\+xml)/i.test(type)
}

/**
 * 依据 Accept-Encoding 匹配压缩算法
 */
function selectEncoding(acceptEncoding: string): 'br' | 'gzip' | 'deflate' | null {
	const accept: string = (acceptEncoding || '').toLowerCase()
	if (accept.includes('br')) {
		return 'br'
	}
	if (accept.includes('gzip')) {
		return 'gzip'
	}
	if (accept.includes('deflate')) {
		return 'deflate'
	}
	return null
}

/**
 * 创建对应算法的压缩 Transform 流
 */
function createCompressor(encoding: 'br' | 'gzip' | 'deflate', brotliQuality: number): zlib.BrotliCompress | zlib.Gzip | zlib.Deflate {
	if (encoding === 'br') {
		return zlib.createBrotliCompress({
			params: { [zlib.constants.BROTLI_PARAM_QUALITY]: brotliQuality },
		})
	}
	if (encoding === 'gzip') {
		return zlib.createGzip()
	}
	return zlib.createDeflate()
}

/**
 * 选取对应算法异步压缩一段 Buffer
 */
async function compressBuffer(encoding: 'br' | 'gzip' | 'deflate', buffer: Buffer, brotliQuality: number): Promise<Buffer> {
	if (encoding === 'br') {
		return brotliAsync(buffer, {
			params: { [zlib.constants.BROTLI_PARAM_QUALITY]: brotliQuality },
		})
	}
	if (encoding === 'gzip') {
		return gzipAsync(buffer, {})
	}
	return deflateAsync(buffer, {})
}

export function compress(options: TCompressOptions = {}): (ctx: TKoaContextExtend, next: koa.Next) => Promise<void> {
	const threshold: number = options.threshold ?? 1024
	const brotliQuality: number = options.brotliQuality ?? 4
	const streamThreshold: number = options.streamThreshold ?? 512 * 1024
	return async (ctx: TKoaContextExtend, next: koa.Next): Promise<void> => {
		ctx.vary('Accept-Encoding')
		await next()
		const body: unknown = ctx.body
		if (body == null || ctx.method === 'HEAD') {
			return
		}
		if (
			ctx.status === httpStatus.NoContent.status ||
			ctx.status === httpStatus.ResetContent.status ||
			ctx.status === httpStatus.NotModified.status
		) {
			return
		}
		/**
		 * 响应头已发送(如上游已开始 pipe 流)时, 无法再改写 Content-Encoding / 替换响应体
		 */
		if (ctx.headerSent || !ctx.writable) {
			return
		}
		if (ctx.response.get('Content-Encoding')) {
			return
		}
		if (!isCompressibleType(ctx.response.get('Content-Type') || (ctx.type as string))) {
			return
		}
		const encoding: 'br' | 'gzip' | 'deflate' | null = selectEncoding(ctx.get('Accept-Encoding'))
		if (!encoding) {
			return
		}
		/**
		 * 可读流: 挂接压缩 Transform, 保持流式, 不缓冲整个响应
		 */
		if (body instanceof Stream) {
			ctx.set('Content-Encoding', encoding)
			ctx.res.removeHeader('Content-Length')
			const compressor: zlib.BrotliCompress | zlib.Gzip | zlib.Deflate = createCompressor(encoding, brotliQuality)
			ctx.body = (body as Stream).pipe(compressor as unknown as NodeJS.WritableStream) as unknown as Stream
			return
		}
		/**
		 * Buffer / string
		 */
		const raw: Buffer = Buffer.isBuffer(body) ? (body as Buffer) : Buffer.from(String(body), 'utf-8')
		if (raw.length < threshold) {
			return
		}
		/**
		 * 大体积内容: 转为流式压缩
		 * 		- 将原始 Buffer 包装为可读流, 经压缩 Transform 后作为响应体输出
		 * 		- 避免一次性同步压缩超大内容阻塞事件循环
		 */
		if (raw.length >= streamThreshold) {
			ctx.set('Content-Encoding', encoding)
			/**
			 * 压缩后数据长度未知, 此处移除 Content-Length
			 */
			ctx.res.removeHeader('Content-Length')
			const compressor: zlib.BrotliCompress | zlib.Gzip | zlib.Deflate = createCompressor(encoding, brotliQuality)
			ctx.body = Readable.from(raw).pipe(compressor as unknown as NodeJS.WritableStream) as unknown as Stream
			return
		}
		/**
		 * 小体积内容: 整体异步压缩
		 */
		const compressed: Buffer = await compressBuffer(encoding, raw, brotliQuality)
		ctx.set('Content-Encoding', encoding)
		ctx.set('Content-Length', String(compressed.length))
		ctx.body = compressed
	}
}
