import { BaseModel } from '../../lib/model/BaseModel'

export class HomeModel extends BaseModel {
	constructor() {
		super()
	}

	async fetchData(): Promise<Record<string, any>> {
		const res: Record<string, any> = {
			results: {
				modelName: `[home model]`,
			},
		}
		return res.results
	}
}
