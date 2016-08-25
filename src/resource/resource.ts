import * as _ from 'lodash';
import {IRecordConstructor, IRecord} from './record';
import {IMap} from '../utils/map';
import {IRequest, IRequestData} from '../adapter/request';
import {IAdapter} from '../adapter/adapter';
import {IResponse, IResponseData} from '../adapter/response';

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
  
  createRecord(data: IMap<any>): R
}

export class Resource<R extends IRecord, A extends IAdapter> implements IResource<R, A> {
  adapter: A;
  identity: string;
  recordConstructor: IRecordConstructor<R>;

  constructor(identity: string, recordConstructor: IRecordConstructor<R>, adapter: A) {
    this.adapter = adapter;
    this.identity = identity;
    this.recordConstructor = recordConstructor;
  }


  createRecord(data: IRequestData): R {
    return new this.recordConstructor(data);
  }


  create(request: IRequest): Promise<R> {
    return this.adapter.create(this, request)
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  findOne(request: IRequest): Promise<R> {
    return this.adapter.findOne(this, request)
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  find(request: IRequest): Promise<Array<R>> {
    return this.adapter.find(this, request)
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
    return this.adapter.save(this, request)
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  destroy(request: IRequest): Promise<R> {
    return this.adapter.destroy(this, request)
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }
}
