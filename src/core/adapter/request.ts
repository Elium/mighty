import * as _ from "lodash";
import {IMap} from "../../common/utils/map";

export type IRequestData = IMap<any> | Array<IMap<any>>;

export interface IRequest {
  data?: IRequestData
  criteria?: IMap<any>
}

export class Request implements IRequest {
  public criteria: IMap<any>;
  public data: IRequestData;

  constructor(config: IRequest) {
    this.data = _.get(config, "data", {});
    this.criteria = _.get(config, "criteria", {});
  }

  public merge(request: IRequest): IRequest {
    return new Request(_.extend(this, request));
  }
}
