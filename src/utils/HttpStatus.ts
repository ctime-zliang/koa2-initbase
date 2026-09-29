import { TErrorExtend } from '../types/services'

export type THttpStatusItem = {
	status: number
	message: () => string
}

export class HttpStatus {
	public static throwError(status: number, error: TErrorExtend): void {
		const err: Error | any = error instanceof Error ? error : new Error((error as Error).toString())
		err.status = status
		throw err
	}
	/**
	 * 1xx Informational
	 */
	private readonly _Continue: THttpStatusItem
	private readonly _SwitchingProtocols: THttpStatusItem
	private readonly _Processing: THttpStatusItem
	private readonly _EarlyHints: THttpStatusItem
	/**
	 * 2xx Success
	 */
	private readonly _OK: THttpStatusItem
	private readonly _Created: THttpStatusItem
	private readonly _Accepted: THttpStatusItem
	private readonly _NonAuthoritativeInformation: THttpStatusItem
	private readonly _NoContent: THttpStatusItem
	private readonly _ResetContent: THttpStatusItem
	private readonly _PartialContent: THttpStatusItem
	private readonly _MultiStatus: THttpStatusItem
	private readonly _AlreadyReported: THttpStatusItem
	private readonly _IMUsed: THttpStatusItem
	/**
	 * 3xx Redirection
	 */
	private readonly _MultipleChoices: THttpStatusItem
	private readonly _MovedPermanently: THttpStatusItem
	private readonly _Found: THttpStatusItem
	private readonly _SeeOther: THttpStatusItem
	private readonly _NotModified: THttpStatusItem
	private readonly _UseProxy: THttpStatusItem
	private readonly _TemporaryRedirect: THttpStatusItem
	private readonly _PermanentRedirect: THttpStatusItem
	/**
	 * 4xx Client Error
	 */
	private readonly _BadRequest: THttpStatusItem
	private readonly _Unauthorized: THttpStatusItem
	private readonly _PaymentRequired: THttpStatusItem
	private readonly _Forbidden: THttpStatusItem
	private readonly _NotFound: THttpStatusItem
	private readonly _MethodNotAllowed: THttpStatusItem
	private readonly _NotAcceptable: THttpStatusItem
	private readonly _ProxyAuthenticationRequired: THttpStatusItem
	private readonly _RequestTimeout: THttpStatusItem
	private readonly _Conflict: THttpStatusItem
	private readonly _Gone: THttpStatusItem
	private readonly _LengthRequired: THttpStatusItem
	private readonly _PreconditionFailed: THttpStatusItem
	private readonly _PayloadTooLarge: THttpStatusItem
	private readonly _URITooLong: THttpStatusItem
	private readonly _UnsupportedMediaType: THttpStatusItem
	private readonly _RangeNotSatisfiable: THttpStatusItem
	private readonly _ExpectationFailed: THttpStatusItem
	private readonly _ImATeapot: THttpStatusItem
	private readonly _MisdirectedRequest: THttpStatusItem
	private readonly _UnprocessableEntity: THttpStatusItem
	private readonly _Locked: THttpStatusItem
	private readonly _FailedDependency: THttpStatusItem
	private readonly _TooEarly: THttpStatusItem
	private readonly _UpgradeRequired: THttpStatusItem
	private readonly _PreconditionRequired: THttpStatusItem
	private readonly _TooManyRequests: THttpStatusItem
	private readonly _RequestHeaderFieldsTooLarge: THttpStatusItem
	private readonly _UnavailableForLegalReasons: THttpStatusItem
	/**
	 * 5xx Server Error
	 */
	private readonly _ServerError: THttpStatusItem
	private readonly _NotImplemented: THttpStatusItem
	private readonly _BadGateway: THttpStatusItem
	private readonly _ServiceUnavailable: THttpStatusItem
	private readonly _GatewayTimeout: THttpStatusItem
	private readonly _HTTPVersionNotSupported: THttpStatusItem
	private readonly _VariantAlsoNegotiates: THttpStatusItem
	private readonly _InsufficientStorage: THttpStatusItem
	private readonly _LoopDetected: THttpStatusItem
	private readonly _NotExtended: THttpStatusItem
	private readonly _NetworkAuthenticationRequired: THttpStatusItem

	constructor() {
		/**
		 * 1xx Informational
		 */
		this._Continue = {
			status: 100,
			message: (): string => {
				return `Continue`
			},
		}
		this._SwitchingProtocols = {
			status: 101,
			message: (): string => {
				return `SwitchingProtocols`
			},
		}
		this._Processing = {
			status: 102,
			message: (): string => {
				return `Processing`
			},
		}
		this._EarlyHints = {
			status: 103,
			message: (): string => {
				return `EarlyHints`
			},
		}
		/**
		 * 2xx Success
		 */
		this._OK = {
			status: 200,
			message: (): string => {
				return `OK`
			},
		}
		this._Created = {
			status: 201,
			message: (): string => {
				return `Created`
			},
		}
		this._Accepted = {
			status: 202,
			message: (): string => {
				return `Accepted`
			},
		}
		this._NonAuthoritativeInformation = {
			status: 203,
			message: (): string => {
				return `NonAuthoritativeInformation`
			},
		}
		this._NoContent = {
			status: 204,
			message: (): string => {
				return `NoContent`
			},
		}
		this._ResetContent = {
			status: 205,
			message: (): string => {
				return `ResetContent`
			},
		}
		this._PartialContent = {
			status: 206,
			message: (): string => {
				return `PartialContent`
			},
		}
		this._MultiStatus = {
			status: 207,
			message: (): string => {
				return `MultiStatus`
			},
		}
		this._AlreadyReported = {
			status: 208,
			message: (): string => {
				return `AlreadyReported`
			},
		}
		this._IMUsed = {
			status: 226,
			message: (): string => {
				return `IMUsed`
			},
		}
		/**
		 * 3xx Redirection
		 */
		this._MultipleChoices = {
			status: 300,
			message: (): string => {
				return `MultipleChoices`
			},
		}
		this._MovedPermanently = {
			status: 301,
			message: (): string => {
				return `MovedPermanently`
			},
		}
		this._Found = {
			status: 302,
			message: (): string => {
				return `Found`
			},
		}
		this._SeeOther = {
			status: 303,
			message: (): string => {
				return `SeeOther`
			},
		}
		this._NotModified = {
			status: 304,
			message: (): string => {
				return `NotModified`
			},
		}
		this._UseProxy = {
			status: 305,
			message: (): string => {
				return `UseProxy`
			},
		}
		this._TemporaryRedirect = {
			status: 307,
			message: (): string => {
				return `TemporaryRedirect`
			},
		}
		this._PermanentRedirect = {
			status: 308,
			message: (): string => {
				return `PermanentRedirect`
			},
		}
		/**
		 * 4xx Client Error
		 */
		this._BadRequest = {
			status: 400,
			message: (): string => {
				return `BadRequest`
			},
		}
		this._Unauthorized = {
			status: 401,
			message: (): string => {
				return `Unauthorized`
			},
		}
		this._PaymentRequired = {
			status: 402,
			message: (): string => {
				return `PaymentRequired`
			},
		}
		this._Forbidden = {
			status: 403,
			message: (): string => {
				return `Forbidden`
			},
		}
		this._NotFound = {
			status: 404,
			message: (): string => {
				return `NotFound`
			},
		}
		this._MethodNotAllowed = {
			status: 405,
			message: (): string => {
				return `MethodNotAllowed`
			},
		}
		this._NotAcceptable = {
			status: 406,
			message: (): string => {
				return `NotAcceptable`
			},
		}
		this._ProxyAuthenticationRequired = {
			status: 407,
			message: (): string => {
				return `ProxyAuthenticationRequired`
			},
		}
		this._RequestTimeout = {
			status: 408,
			message: (): string => {
				return `RequestTimeout`
			},
		}
		this._Conflict = {
			status: 409,
			message: (): string => {
				return `Conflict`
			},
		}
		this._Gone = {
			status: 410,
			message: (): string => {
				return `Gone`
			},
		}
		this._LengthRequired = {
			status: 411,
			message: (): string => {
				return `LengthRequired`
			},
		}
		this._PreconditionFailed = {
			status: 412,
			message: (): string => {
				return `PreconditionFailed`
			},
		}
		this._PayloadTooLarge = {
			status: 413,
			message: (): string => {
				return `PayloadTooLarge`
			},
		}
		this._URITooLong = {
			status: 414,
			message: (): string => {
				return `URITooLong`
			},
		}
		this._UnsupportedMediaType = {
			status: 415,
			message: (): string => {
				return `UnsupportedMediaType`
			},
		}
		this._RangeNotSatisfiable = {
			status: 416,
			message: (): string => {
				return `RangeNotSatisfiable`
			},
		}
		this._ExpectationFailed = {
			status: 417,
			message: (): string => {
				return `ExpectationFailed`
			},
		}
		this._ImATeapot = {
			status: 418,
			message: (): string => {
				return `ImATeapot`
			},
		}
		this._MisdirectedRequest = {
			status: 421,
			message: (): string => {
				return `MisdirectedRequest`
			},
		}
		this._UnprocessableEntity = {
			status: 422,
			message: (): string => {
				return `UnprocessableEntity`
			},
		}
		this._Locked = {
			status: 423,
			message: (): string => {
				return `Locked`
			},
		}
		this._FailedDependency = {
			status: 424,
			message: (): string => {
				return `FailedDependency`
			},
		}
		this._TooEarly = {
			status: 425,
			message: (): string => {
				return `TooEarly`
			},
		}
		this._UpgradeRequired = {
			status: 426,
			message: (): string => {
				return `UpgradeRequired`
			},
		}
		this._PreconditionRequired = {
			status: 428,
			message: (): string => {
				return `PreconditionRequired`
			},
		}
		this._TooManyRequests = {
			status: 429,
			message: (): string => {
				return `TooManyRequests`
			},
		}
		this._RequestHeaderFieldsTooLarge = {
			status: 431,
			message: (): string => {
				return `RequestHeaderFieldsTooLarge`
			},
		}
		this._UnavailableForLegalReasons = {
			status: 451,
			message: (): string => {
				return `UnavailableForLegalReasons`
			},
		}
		/**
		 * 5xx Server Error
		 */
		this._ServerError = {
			status: 500,
			message: (): string => {
				return `ServerError`
			},
		}
		this._NotImplemented = {
			status: 501,
			message: (): string => {
				return `NotImplemented`
			},
		}
		this._BadGateway = {
			status: 502,
			message: (): string => {
				return `BadGateway`
			},
		}
		this._ServiceUnavailable = {
			status: 503,
			message: (): string => {
				return `ServiceUnavailable`
			},
		}
		this._GatewayTimeout = {
			status: 504,
			message: (): string => {
				return `GatewayTimeout`
			},
		}
		this._HTTPVersionNotSupported = {
			status: 505,
			message: (): string => {
				return `HTTPVersionNotSupported`
			},
		}
		this._VariantAlsoNegotiates = {
			status: 506,
			message: (): string => {
				return `VariantAlsoNegotiates`
			},
		}
		this._InsufficientStorage = {
			status: 507,
			message: (): string => {
				return `InsufficientStorage`
			},
		}
		this._LoopDetected = {
			status: 508,
			message: (): string => {
				return `LoopDetected`
			},
		}
		this._NotExtended = {
			status: 510,
			message: (): string => {
				return `NotExtended`
			},
		}
		this._NetworkAuthenticationRequired = {
			status: 511,
			message: (): string => {
				return `NetworkAuthenticationRequired`
			},
		}
	}

	/**
	 * 1xx Informational
	 */
	public get Continue(): THttpStatusItem {
		return this._Continue
	}
	public get SwitchingProtocols(): THttpStatusItem {
		return this._SwitchingProtocols
	}
	public get Processing(): THttpStatusItem {
		return this._Processing
	}
	public get EarlyHints(): THttpStatusItem {
		return this._EarlyHints
	}
	/**
	 * 2xx Success
	 */
	public get OK(): THttpStatusItem {
		return this._OK
	}
	public get Created(): THttpStatusItem {
		return this._Created
	}
	public get Accepted(): THttpStatusItem {
		return this._Accepted
	}
	public get NonAuthoritativeInformation(): THttpStatusItem {
		return this._NonAuthoritativeInformation
	}
	public get NoContent(): THttpStatusItem {
		return this._NoContent
	}
	public get ResetContent(): THttpStatusItem {
		return this._ResetContent
	}
	public get PartialContent(): THttpStatusItem {
		return this._PartialContent
	}
	public get MultiStatus(): THttpStatusItem {
		return this._MultiStatus
	}
	public get AlreadyReported(): THttpStatusItem {
		return this._AlreadyReported
	}
	public get IMUsed(): THttpStatusItem {
		return this._IMUsed
	}
	/**
	 * 3xx Redirection
	 */
	public get MultipleChoices(): THttpStatusItem {
		return this._MultipleChoices
	}
	public get MovedPermanently(): THttpStatusItem {
		return this._MovedPermanently
	}
	public get Found(): THttpStatusItem {
		return this._Found
	}
	public get SeeOther(): THttpStatusItem {
		return this._SeeOther
	}
	public get NotModified(): THttpStatusItem {
		return this._NotModified
	}
	public get UseProxy(): THttpStatusItem {
		return this._UseProxy
	}
	public get TemporaryRedirect(): THttpStatusItem {
		return this._TemporaryRedirect
	}
	public get PermanentRedirect(): THttpStatusItem {
		return this._PermanentRedirect
	}
	/**
	 * 4xx Client Error
	 */
	public get BadRequest(): THttpStatusItem {
		return this._BadRequest
	}
	public get Unauthorized(): THttpStatusItem {
		return this._Unauthorized
	}
	public get PaymentRequired(): THttpStatusItem {
		return this._PaymentRequired
	}
	public get Forbidden(): THttpStatusItem {
		return this._Forbidden
	}
	public get NotFound(): THttpStatusItem {
		return this._NotFound
	}
	public get MethodNotAllowed(): THttpStatusItem {
		return this._MethodNotAllowed
	}
	public get NotAcceptable(): THttpStatusItem {
		return this._NotAcceptable
	}
	public get ProxyAuthenticationRequired(): THttpStatusItem {
		return this._ProxyAuthenticationRequired
	}
	public get RequestTimeout(): THttpStatusItem {
		return this._RequestTimeout
	}
	public get Conflict(): THttpStatusItem {
		return this._Conflict
	}
	public get Gone(): THttpStatusItem {
		return this._Gone
	}
	public get LengthRequired(): THttpStatusItem {
		return this._LengthRequired
	}
	public get PreconditionFailed(): THttpStatusItem {
		return this._PreconditionFailed
	}
	public get PayloadTooLarge(): THttpStatusItem {
		return this._PayloadTooLarge
	}
	public get URITooLong(): THttpStatusItem {
		return this._URITooLong
	}
	public get UnsupportedMediaType(): THttpStatusItem {
		return this._UnsupportedMediaType
	}
	public get RangeNotSatisfiable(): THttpStatusItem {
		return this._RangeNotSatisfiable
	}
	public get ExpectationFailed(): THttpStatusItem {
		return this._ExpectationFailed
	}
	public get ImATeapot(): THttpStatusItem {
		return this._ImATeapot
	}
	public get MisdirectedRequest(): THttpStatusItem {
		return this._MisdirectedRequest
	}
	public get UnprocessableEntity(): THttpStatusItem {
		return this._UnprocessableEntity
	}
	public get Locked(): THttpStatusItem {
		return this._Locked
	}
	public get FailedDependency(): THttpStatusItem {
		return this._FailedDependency
	}
	public get TooEarly(): THttpStatusItem {
		return this._TooEarly
	}
	public get UpgradeRequired(): THttpStatusItem {
		return this._UpgradeRequired
	}
	public get PreconditionRequired(): THttpStatusItem {
		return this._PreconditionRequired
	}
	public get TooManyRequests(): THttpStatusItem {
		return this._TooManyRequests
	}
	public get RequestHeaderFieldsTooLarge(): THttpStatusItem {
		return this._RequestHeaderFieldsTooLarge
	}
	public get UnavailableForLegalReasons(): THttpStatusItem {
		return this._UnavailableForLegalReasons
	}
	/**
	 * 5xx Server Error
	 */
	public get ServerError(): THttpStatusItem {
		return this._ServerError
	}
	public get NotImplemented(): THttpStatusItem {
		return this._NotImplemented
	}
	public get BadGateway(): THttpStatusItem {
		return this._BadGateway
	}
	public get ServiceUnavailable(): THttpStatusItem {
		return this._ServiceUnavailable
	}
	public get GatewayTimeout(): THttpStatusItem {
		return this._GatewayTimeout
	}
	public get HTTPVersionNotSupported(): THttpStatusItem {
		return this._HTTPVersionNotSupported
	}
	public get VariantAlsoNegotiates(): THttpStatusItem {
		return this._VariantAlsoNegotiates
	}
	public get InsufficientStorage(): THttpStatusItem {
		return this._InsufficientStorage
	}
	public get LoopDetected(): THttpStatusItem {
		return this._LoopDetected
	}
	public get NotExtended(): THttpStatusItem {
		return this._NotExtended
	}
	public get NetworkAuthenticationRequired(): THttpStatusItem {
		return this._NetworkAuthenticationRequired
	}
}

export const httpStatus = new HttpStatus()
