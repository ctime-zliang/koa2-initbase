import { BaseService } from '../../lib/service/BaseService'
import { BaiDuTranslationModel } from '../model/BaiDuTranslationModel'
import { httpStatus } from '../../utils/HttpStatus'
import { BaiDuTranslationStatus } from '../status/BaiDuTranslationStatus'

const BAIDU_LANG_MAP: Record<string, string> = {
	'zh-CN': 'zh',
	'en-US': 'en',
	'ru-RU': 'ru',
	'de-DE': 'de',
	'es-ES': 'spa',
	'fr-FR': 'fra',
	'ja-JP': 'jp',
	'it-IT': 'it',
	'tr-TR': 'tr',
	'pt-BR': 'pt',
	'pl-PL': 'pl',
	'ko-KR': 'kor',
	'th-TH': 'th',
	'id-ID': 'id',
	'vi-VN': 'vie',
	'sv-SE': 'swe',
}

function toBaiduLang(lang: string): string {
	if (!lang) {
		return 'auto'
	}
	if (BAIDU_LANG_MAP[lang]) {
		return BAIDU_LANG_MAP[lang]
	}
	const lower: string = lang.toLowerCase()
	const hit: string | undefined = Object.keys(BAIDU_LANG_MAP).find((k: string): boolean => {
		return k.toLowerCase() === lower
	})
	if (hit) {
		return BAIDU_LANG_MAP[hit]
	}
	const shortHit: string | undefined = Object.keys(BAIDU_LANG_MAP).find((k: string): boolean => {
		return k.toLowerCase().split('-')[0] === lower.split('-')[0]
	})
	return shortHit ? BAIDU_LANG_MAP[shortHit] : 'auto'
}

export class BaiDuTranslationService extends BaseService {
	private readonly baiduTranslationStatusStatus: BaiDuTranslationStatus
	private readonly baiduTranslationModel: BaiDuTranslationModel
	constructor() {
		super()
		this.baiduTranslationStatusStatus = new BaiDuTranslationStatus()
		this.baiduTranslationModel = new BaiDuTranslationModel()
	}

	public async baiduTranslation(
		sourceLang: string,
		items: Array<{ id: string; target: string; text: string }>
	): Promise<{ status: number; message: string; data: any }> {
		if (!sourceLang || !Array.isArray(items) || items.length === 0) {
			return {
				status: this.baiduTranslationStatusStatus.Invalid_Parameter.status,
				message: this.baiduTranslationStatusStatus.Invalid_Parameter.message(),
				data: null,
			}
		}
		const taskList: Array<Promise<{ id: number | string; target: string; text: string; translation: string }>> = []
		for (let i: number = 0; i < items.length; i++) {
			taskList.push(
				new Promise<{ id: number | string; target: string; text: string; translation: string }>(async (resolve): Promise<void> => {
					const text: string = typeof items[i].text === 'string' ? (items[i].text || '').trim() : ''
					if (!text) {
						return resolve({
							id: items[i].id,
							target: items[i]?.target,
							text,
							translation: '',
						})
					}
					const dsts: Array<string> = await this.baiduTranslationModel.baiduTranslation(
						text,
						toBaiduLang(sourceLang),
						toBaiduLang(items[i].target)
					)
					return resolve({
						id: items[i].id,
						target: items[i].target,
						text,
						translation: dsts.join('\n'),
					})
				})
			)
		}
		try {
			const translatedItems: Array<{ id: number | string; target: string; text: string; translation: string }> = await Promise.all(taskList)
			return {
				status: httpStatus.OK.status,
				message: '',
				data: {
					items: translatedItems,
				},
			}
		} catch (err) {
			console.error(err)
			return {
				status: httpStatus.ServerError.status,
				message: httpStatus.ServerError.message() + ': ' + 'translate failed',
				data: null,
			}
		}
	}
}
