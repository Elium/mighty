import * as _ from 'lodash'
import {IRequestData, IRequest} from './request'

export type IResponseData = IRequestData;

export interface IResponse {
  data?: IResponseData
  error?: Error
  request?: IRequest
}

export class Response implements IResponse {
  data: IResponseData
  error: Error
  request: IRequest
  
  constructor(config?: IResponse) {
    this.data = _.get(config, "data", {})
    this.error = _.get(config, "error", null)
    this.request = _.get(config, "request", null)
  }
}
