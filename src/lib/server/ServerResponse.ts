import { EDocumentType } from '../../config/enums'
import { TKoaContextExtend } from '../../types/services'
import { httpStatus } from '../../utils/HttpStatus'
import { responseStatus } from '../../utils/ResponseStatus'
import { sanitizeDeep } from '../../utils/sanitize'

export class ServerResponse {
	private _isSet: boolean
	private _data: any
	private _msg: string
	private _status: number
	private _code: number
	private _outType: EDocumentType
	constructor() {
		this._isSet = false
		this._status = httpStatus.OK.status
		this._data = null
		this._code = responseStatus.OK.status
		this._msg = responseStatus.OK.message()
		this._outType = EDocumentType.UNKNOWN
	}

	public get isSet(): boolean {
		return this._isSet
	}

	public set data(value: any) {
		this._data = value
	}
	public get data(): any {
		return this._data
	}

	public set msg(value: string) {
		this._msg = value
	}
	public get msg(): string {
		return this._msg
	}

	public set status(value: number) {
		this._status = value
	}
	public get status(): number {
		return this._status
	}

	public set code(value: number) {
		this._code = value
	}
	public get code(): number {
		return this._code
	}

	public set outType(value: EDocumentType) {
		this._outType = value
	}
	public get outType(): EDocumentType {
		return this._outType
	}

	public resetDefaults(
		status: number = httpStatus.OK.status,
		code: number = responseStatus.OK.status,
		msg: string = responseStatus.OK.message()
	): void {
		this._status = status
		this._code = code
		this._msg = msg
		this._data = null
		this._outType = EDocumentType.UNKNOWN
	}

	public async flush(ctx: TKoaContextExtend): Promise<ServerResponse> {
		switch (this.outType) {
			case EDocumentType.VIEW: {
				const { view, params } = this.data as { view: string; params: Record<string, any> }
				ctx.status = this.status
				await ctx.render(view, params)
				return this
			}
			case EDocumentType.JSON: {
				ctx.status = this.status
				ctx.type = 'application/json'
				ctx.body = JSON.stringify(this.toJSON())
				return this
			}
			case EDocumentType.HTML: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			case EDocumentType.TEXT: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			case EDocumentType.BINARY: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
			default: {
				ctx.status = this.status
				ctx.body = this.data
				return this
			}
		}
	}

	public setJson(data: any = null): ServerResponse {
		this._isSet = true
		this._outType = EDocumentType.JSON
		this._data = data
		return this
	}

	public setHtml(data: any = null): ServerResponse {
		this._isSet = true
		this._outType = EDocumentType.HTML
		this._data = data
		return this
	}

	/**
	 * 设置视图渲染
	 * 		- 默认对传入模板的 params 做深度 HTML 转义, 消除反射型 XSS
	 * 		- 若某些字段需要输出原始 HTML(受信内容), 可将 escape 置为 false 并自行保证安全
	 */
	public setView(view: string, params: Record<string, any> = {}, escape: boolean = true): ServerResponse {
		this._isSet = true
		this._outType = EDocumentType.VIEW
		this._data = { view, params: escape ? sanitizeDeep(params) : params }
		return this
	}

	public setBinary(data: any = null): ServerResponse {
		this._isSet = true
		this._outType = EDocumentType.BINARY
		this._data = data
		return this
	}

	public setText(data: any = null): ServerResponse {
		this._isSet = true
		this._outType = EDocumentType.TEXT
		this._data = data
		return this
	}

	public toJSON(): {
		code: number
		msg: string
		data: any
		time: number
	} {
		return {
			code: this.code,
			msg: this.msg,
			data: this.data,
			time: Date.now(),
		}
	}
}
