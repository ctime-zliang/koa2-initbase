import { httpStatus } from '../../utils/HttpStatus'
import { ResponseStatus, TResponseStatusItem } from '../../utils/ResponseStatus'

export class BaiDuTranslationStatus extends ResponseStatus {
	private _Invalid_Parameter: TResponseStatusItem
	constructor() {
		super()
		this._Invalid_Parameter = {
			status: httpStatus.BadRequest.status,
			message: (): string => {
				return httpStatus.BadRequest.message() + ': ' + 'illegal argument'
			},
		}
	}

	public get Invalid_Parameter(): TResponseStatusItem {
		return this._Invalid_Parameter
	}
}
