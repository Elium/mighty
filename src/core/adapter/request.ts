import * as _ from 'lodash';
import {IMap} from '../utils/map';

export type IRequestData = IMap<any> | Array<IMap<any>>;

export interface IRequest {
  data?: IRequestData
  criteria?: IMap<any>
}

export class Request implements IRequest {
  criteria: IMap<any>;
  data: IRequestData;

  constructor(config: IMap<any>) {
    this.data = _.get(config, "data", {});
    this.criteria = _.get(config, "criteria", {});
  }
}
