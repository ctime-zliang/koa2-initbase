export type TResponseStatusItem = {
	status: number
	message: () => string
}

export class ResponseStatus {
	private readonly _OK: TResponseStatusItem
	private readonly _ServiceError: TResponseStatusItem
	constructor() {
		this._OK = {
			status: 0,
			message: (): string => {
				return `OK`
			},
		}
		this._ServiceError = {
			status: -1,
			message: (): string => {
				return `Service Error`
			},
		}
	}

	public get OK(): TResponseStatusItem {
		return this._OK
	}

	public get ServiceError(): TResponseStatusItem {
		return this._ServiceError
	}
}

export const responseStatus = new ResponseStatus()
