import * as _ from "lodash"
import {IResponse, Response} from '../core/adapter/response'

export interface IHttpResponse extends IResponse {
  status?: number
}

export class HttpResponse extends Response implements IHttpResponse {
  status: number
  
  constructor(config?: IHttpResponse) {
    super(config)
    this.status = _.get(config, "status", 0)
  }
}
