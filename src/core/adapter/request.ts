import * as _ from 'lodash';
import {IMap} from '../../common/utils/map';

export type IRequestData = IMap<any> | Array<IMap<any>>;

export interface IRequest {
  data?: IRequestData
  criteria?: IMap<any>
  populate?: Array<string>;
}

export class Request implements IRequest {
  public criteria: IMap<any>;
  public data: IRequestData;
  public populate: Array<string>;

  constructor(config: IRequest) {
    this.data = _.get(config, "data", {});
    this.criteria = _.get(config, "criteria", {});
    this.populate = _.get(config, "populate", []);
  }

  public toJson(): IRequest {
    return {
      data: this.data,
      criteria: this.criteria,
      populate: this.populate
    };
  }

  public merge(request: IRequest): IRequest {
    return new Request(_.merge({}, this.toJson(), request));
  }
}
