import { ResponseStatus, TResponseStatusItem } from '../../utils/ResponseStatus'

export class HomeStatus extends ResponseStatus {
	private _NO_ID: TResponseStatusItem
	constructor() {
		super()
		this._NO_ID = {
			status: -100001,
			message: (): string => {
				return `[home status]: ID does not exist or the value is illegal`
			},
		}
	}

	public get NO_ID(): TResponseStatusItem {
		return this._NO_ID
	}
}
