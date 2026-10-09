import crypto from 'crypto'
import { BaseModel } from '../../lib/model/BaseModel'
import { proxyRequest } from '../../utils/proxyRequest'
import { EHttpMethods } from '../../config/enums'

const APP_ID: string = '20260911002682636'
const SECRET_KEY: string = 'XcN_HKB9pEQBXTAoQ2gY'
const BAIDU_API: string = 'http://api.fanyi.baidu.com/api/trans/vip/translate'

function buildSign(q: string, salt: string): string {
	return crypto
		.createHash('md5')
		.update(APP_ID + q + salt + SECRET_KEY)
		.digest('hex')
}

export class BaiDuTranslationModel extends BaseModel {
	constructor() {
		super()
	}

	async baiduTranslation(q: string, from: string, to: string): Promise<Array<string>> {
		const salt: string = Date.now().toString()
		const sign: string = buildSign(q, salt)
		const body: string = new URLSearchParams({
			q,
			from,
			to,
			appid: APP_ID,
			salt,
			sign,
		}).toString()
		const response = await proxyRequest(BAIDU_API, {
			method: EHttpMethods.POST,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(body),
			},
			body,
		})
		const data: any = response.json ? await response.json() : null
		if (data && data.error_code) {
			throw new Error(`baidu error ${data.error_code}: ${data.error_msg}`)
		}
		const results: Array<any> = Array.isArray(data.trans_result) ? data.trans_result : []
		return results.map((r: any): string => {
			return r.dst
		})
	}
}
