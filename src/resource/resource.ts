import * as _ from 'lodash';
import {IRecordConstructor, IRecord} from './record';
import {IMap} from '../utils/map';
import {IRequest, IRequestData} from '../adapter/request';
import {IAdapter} from '../adapter/adapter';
import {IResponse, IResponseData} from '../adapter/response';
import {hookable, IHookable, IHook} from '../utils/hook';

export interface IResourceAdapter<R extends IRecord> {
  create(adapter: IAdapter, request: IRequest): Promise<R>
  findOne(adapter: IAdapter, request: IRequest): Promise<R>
  find(adapter: IAdapter, request: IRequest): Promise<Array<R>>
  save(adapter: IAdapter, request: IRequest): Promise<R>
  destroy(adapter: IAdapter, request: IRequest): Promise<R>
}

export interface IResource<R extends IRecord> extends IResourceAdapter<R> {
  identity: string
  recordConstructor: IRecordConstructor<R>;

  createRecord(data: IMap<any>): R
}

@hookable
export class Resource<R extends IRecord> implements IResource<R>, IHookable {
  identity: string;
  recordConstructor: IRecordConstructor<R>;

  constructor(identity: string,
              recordConstructor: IRecordConstructor<R>) {
    this.identity = identity;
    this.recordConstructor = recordConstructor;
  }

  addHook: (hook: IHook) => void;
  removeHook: (name: string) => void;
  applyHook: <I, O>(name: string, input: I) => Promise<O>;

  createRecord(data: IRequestData): R {
    return new this.recordConstructor(data);
  }

  create(adapter: IAdapter, request: IRequest): Promise<R> {
    return this.applyHook('beforeCreate', request)
      .then(newRequest => adapter.create(this, newRequest))
      .then(response => this.applyHook('afterCreate', response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data))
  }

  findOne(adapter: IAdapter, request: IRequest): Promise<R> {
    return this.applyHook('beforeFindOne', request)
      .then(newRequest => adapter.findOne(this, newRequest))
      .then(response => this.applyHook('afterFindOne', response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data))
  }

  find(adapter: IAdapter, request: IRequest): Promise<Array<R>> {
    return this.applyHook('beforeFind', request)
      .then(newRequest => adapter.find(this, newRequest))
      .then(response => this.applyHook('afterFind', response))
      .then((response: IResponse) => {
        const values: IResponseData = response.data;
        if (Array.isArray(values)) {
          return values.map((value) => this.createRecord(value));
        } else {
          return [];
        }
      });
  }

  save(adapter: IAdapter, request: IRequest): Promise<R> {
    return this.applyHook('beforeSave', request)
      .then(newRequest => adapter.save(this, newRequest))
      .then(response => this.applyHook('beforeSave', response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data))
  }

  destroy(adapter: IAdapter, request: IRequest): Promise<R> {
    return this.applyHook('beforeSave', request)
      .then(newRequest => adapter.destroy(this, newRequest))
      .then(response => this.applyHook('beforeSave', response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data))
  }
}
