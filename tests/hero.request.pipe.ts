import * as _ from "lodash";
import {RequestPipe} from "../src/core/pipe/request.pipe";
import {IRequest, Request} from "../src/core/adapter/request";

export class HeroRequestPipe extends RequestPipe {
  public create(request: IRequest): IRequest { return this._query(request); }
  public find(request: IRequest): IRequest { return this._query(request); }
  public findOne(request: IRequest): IRequest { return this._query(request); }
  public save(request: IRequest): IRequest { return this._query(request); }
  public destroy(request: IRequest): IRequest { return this._query(request); }

  public _query(request: IRequest): IRequest {
    const newRequest = new Request({data: _.get(request.data, "child")});
    return request.merge(newRequest);
  }
}
