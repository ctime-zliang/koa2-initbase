export class HttpError extends Error {
	private readonly _name: string
	private _status: number
	constructor(status: number, message: string) {
		super(message)
		this._status = status
		this._name = 'HttpError'
	}

	public get name(): string {
		return this._name
	}

	public get status(): number {
		return this._status
	}
	public set status(value: number) {
		this._status = value
	}
}
