import * as _ from 'lodash';
import {IRequestData} from './request';

export type IResponseData = IRequestData;

export interface IResponse {
  data?: IResponseData
  error?: Error
}

export class Response implements IResponse {
  public data: IResponseData;
  public error: Error;

  constructor(config?: IResponse) {
    this.data = _.get(config, "data", {});
    this.error = _.get(config, "error", null);
  }
}
