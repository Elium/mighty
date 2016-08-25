import * as _ from 'lodash';
import {IMap} from '../utils/map';

export type IRequestData = IMap<any> | Array<IMap<any>>;

export interface IRequest {
  data?: IRequestData
  criteria?: IMap<any>
  populate?: Array<string>;
}

export class Request implements IRequest {
  criteria: IMap<any>;
  data: IRequestData;
  populate: Array<string>;

  constructor(config: IRequest) {
    this.data = _.get(config, "data", {});
    this.criteria = _.get(config, "criteria", {});
    this.populate = _.get(config, "populate", []);
  }

  toJson(): IRequest {
    return {
      data: this.data,
      criteria: this.criteria,
      populate: this.populate
    };
  }

  merge(request: IRequest): IRequest {
    return new Request(_.merge({}, this.toJson(), request));
  }
}
