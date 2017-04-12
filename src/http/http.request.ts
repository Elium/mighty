import * as _ from 'lodash'
import {IRequest, Request} from '../core/adapter/request'
import {IMap} from '../core/utils/map'

export interface IHttpRequest extends IRequest {
  data?: any;
  url?: string;
  method?: string;
  isArray?: boolean;
  params?: IMap<string>;
  headers?: IMap<string>;
}

export class HttpRequest extends Request implements IHttpRequest {
  data: any
  url: string
  method: string
  isArray: boolean
  params: IMap<string>
  headers: IMap<string>
  
  constructor(config: any) {
    super(config)
    config = config || {}
    
    this.url = _.get(config, 'url', '')
    this.data = _.get(config, 'data', {})
    this.method = _.get(config, 'method', "UNKNOWN")
    this.isArray = config.isArray === true
    this.params = _.get(config, 'params', <IMap<string>> {})
    this.headers = _.get(config, 'headers', <IMap<string>> {})
  }
}
