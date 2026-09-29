import { getEnvBoolValue, getEnvNumberValue, getEnvStringList, getEnvValue } from '../utils/envUtils'
import { serverConfig } from './config'

/**
 * 远程代理配置
 */
export const enableProxyRemote: boolean = getEnvBoolValue('PROXY_REMOTE_ENABLE', false)
export const proxyRemoteBaseURL: string = getEnvValue('PROXY_REMOTE_BASE_URL', `http://${serverConfig.host}:${serverConfig.port}/editor`)

/**
 * 代理目标主机白名单 (host 或 host:port)
 */
export const proxyAllowedHosts: Array<string> = getEnvStringList(
	'PROXY_ALLOWED_HOSTS',
	((): Array<string> => {
		try {
			return [new URL(proxyRemoteBaseURL).host]
		} catch {
			return []
		}
	})()
)

/**
 * 代理请求相关限制
 */
export const proxyRequestConfig = {
	/**
	 * 单次请求超时 (ms)
	 */
	timeout: getEnvNumberValue('PROXY_TIMEOUT', 10000),
	/**
	 * 最大重定向次数
	 */
	maxRedirects: getEnvNumberValue('PROXY_MAX_REDIRECTS', 3),
	/**
	 * 响应体最大字节数 (默认 10MB), 防止内存过爆
	 */
	maxContentLength: getEnvNumberValue('PROXY_MAX_CONTENT_LENGTH', 10 * 1024 * 1024),
	/**
	 * keepAlive Agent 的最大 socket 数
	 */
	maxSockets: getEnvNumberValue('PROXY_MAX_SOCKETS', 128),
	maxFreeSockets: getEnvNumberValue('PROXY_MAX_FREE_SOCKETS', 32),
}
