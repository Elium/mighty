import * as _ from "lodash";
import {IRequestData} from "./request";

export type IResponseData = IRequestData;

export interface IResponse {
  data?: IResponseData
  error?: Error
}

export class Response implements IResponse {
  private _data: IResponseData;
  private _error: Error;

  constructor(config: IResponse) {
    this._data = _.get(config, "data", {});
    this._error = _.get(config, "error", null);
  }

  public get data(): IResponseData {
    return this._data;
  }

  public get error(): Error {
    return this._error;
  }
}
