import fs from 'fs'
import { normalize, basename, extname, resolve, sep, isAbsolute } from 'path'
import { HttpError } from './HttpError'
import { httpStatus } from './HttpStatus'

const access = fs.promises.access

export async function exists(path: string): Promise<boolean> {
	try {
		await access(path)
		return true
	} catch {
		return false
	}
}

export function decode(path: string): string | null {
	try {
		return decodeURIComponent(path)
	} catch {
		return null
	}
}

export function isHidden(root: string, path: string): boolean {
	const segments: Array<string> = path.substr(root.length).split(sep)
	for (const segment of segments) {
		if (segment[0] === '.') {
			return true
		}
	}
	return false
}

/**
 * 计算响应的文件类型
 * 		当返回了预压缩文件 (.br / .gz) 时, 需要基于去掉压缩扩展名后的真实文件名判断类型
 */
export function fileType(file: string, encodingExt: string): string {
	return encodingExt !== '' ? extname(basename(file, encodingExt)) : extname(file)
}

/**
 * 安全地将相对路径解析到 root 下, 阻止路径穿越 (../) 与绝对路径逃逸
 *      - 拒绝 NULL 字节
 *      - 拒绝绝对路径
 *      - 解析后必须仍位于 root 之内
 */
export function resolveSafePath(root: string, relativePath: string): string {
	if (relativePath.includes('\0')) {
		throw new HttpError(httpStatus.BadRequest.status, httpStatus.BadRequest.message())
	}
	if (isAbsolute(relativePath)) {
		throw new HttpError(httpStatus.BadRequest.status, httpStatus.BadRequest.message())
	}
	const normalized: string = normalize(relativePath)
	if (normalized === '..' || normalized.startsWith('..' + sep)) {
		throw new HttpError(httpStatus.Forbidden.status, httpStatus.Forbidden.message())
	}
	const resolved: string = resolve(root, normalized)
	if (resolved !== root && !resolved.startsWith(root + sep)) {
		throw new HttpError(httpStatus.Forbidden.status, httpStatus.Forbidden.message())
	}
	return resolved
}
