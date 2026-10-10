import OpenAI, { APIPromise } from 'openai'
import { Controller } from '../../lib/controller/Controller'
import { ServerResponse } from '../../lib/response/ServerResponse'
import { TKoaContextExtend } from '../../types/services'

const openai: OpenAI = new OpenAI({
	baseURL: 'https://api.deepseek.com',
	apiKey: 'sk-8a83d99e25744a2e95c1620c889718e[1-10]',
})

export class OpenAIController extends Controller {
	constructor() {
		super()
	}

	public async render(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {}

	public async deepseekAITest(ctx: TKoaContextExtend, serRes: ServerResponse): Promise<void> {
		console.time(`deepseekAITest`)
		const completion: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
			messages: [{ role: 'user', content: '查询中国时区的当前日期时间' }],
			model: 'deepseek-chat',
		})
		console.timeEnd(`deepseekAITest`)
		serRes.setJson({
			text: 'open-ai',
			...completion,
		})
	}
}
