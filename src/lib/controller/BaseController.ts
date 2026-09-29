import EventEmitter from 'events'
import { TKoaContextExtend } from '../../types/services'
import { ServerResponse } from '../server/ServerResponse'

export abstract class BaseController extends EventEmitter {
	public abstract render(ctx: TKoaContextExtend, res: ServerResponse): Promise<any>
}
