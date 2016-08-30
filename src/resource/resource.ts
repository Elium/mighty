import * as _ from 'lodash';
import {IRecordConstructor, IRecord} from './record';
import {IMap} from '../utils/map';
import {IRequest, IRequestData} from '../adapter/request';
import {IAdapter} from '../adapter/adapter';
import {IResponse, IResponseData} from '../adapter/response';
import {IPipe, RequestPipe, ResponsePipe} from './pipe';

export interface IResourceAdapter<R extends IRecord> {
  create(request: IRequest): Promise<R>
  findOne(request: IRequest): Promise<R>
  find(request: IRequest): Promise<Array<R>>
  save(request: IRequest): Promise<R>
  destroy(request: IRequest): Promise<R>
}

export interface IResource<R extends IRecord, A extends IAdapter> extends IResourceAdapter<R> {
  adapter: A
  identity: string
  recordConstructor: IRecordConstructor<R>;
  requestPipe: IPipe<IRequest, IRequest>;
  responsePipe: IPipe<IResponse, IResponse>;
  
  createRecord(data: IMap<any>): R
}

export class Resource<R extends IRecord, A extends IAdapter> implements IResource<R, A> {
  adapter: A;
  identity: string;
  recordConstructor: IRecordConstructor<R>;
  requestPipe: IPipe<IRequest, IRequest>;
  responsePipe: IPipe<IResponse, IResponse>;
  
  constructor(identity: string, recordConstructor: IRecordConstructor<R>, adapter: A,
              requestPipe?: IPipe<IRequest, IRequest>,
              responsePipe?: IPipe<IResponse, IResponse>) {
    this.adapter = adapter;
    this.identity = identity;
    this.recordConstructor = recordConstructor;
    this.requestPipe = requestPipe || new RequestPipe();
    this.responsePipe = responsePipe || new ResponsePipe();
  }
  
  createRecord(data: IRequestData): R {
    return _.isEmpty(data) ? null : new this.recordConstructor(data);
  }
  
  create(request: IRequest): Promise<R> {
    return this.adapter.create(this, this.requestPipe.create(request))
      .then((response: IResponse) => this.responsePipe.create(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }
  
  findOne(request: IRequest): Promise<R> {
    return this.adapter.findOne(this, this.requestPipe.findOne(request))
      .then((response: IResponse) => this.responsePipe.findOne(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }
  
  find(request: IRequest): Promise<Array<R>> {
    return this.adapter.find(this, this.requestPipe.find(request))
      .then((response: IResponse) => this.responsePipe.find(response))
      .then((response: IResponse) => {
        const values: IResponseData = response.data;
        if (Array.isArray(values)) {
          return values.map((value) => this.createRecord(value));
        } else {
          return [];
        }
      });
  }
  
  save(request: IRequest): Promise<R> {
    return this.adapter.save(this, this.requestPipe.save(request))
      .then((response: IResponse) => this.responsePipe.save(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }
  
  destroy(request: IRequest): Promise<R> {
    return this.adapter.destroy(this, this.requestPipe.destroy(request))
      .then((response: IResponse) => this.responsePipe.destroy(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }
}
