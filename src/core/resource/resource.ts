import * as _ from 'lodash';
import {IRecordConstructor, IRecord} from './record';
import {IMap} from '../utils/map';
import {IRequest, IRequestData} from '../adapter/request';
import {IAdapter} from '../adapter/adapter';
import {IResponse, IResponseData} from '../adapter/response';
import {hookable, IHookable, IHook} from '../utils/hook';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';

export interface IResourceAdapter<R extends IRecord> {
  create(adapter: IAdapter, request: IRequest): Observable<R>
  findOne(adapter: IAdapter, request: IRequest): Observable<R>
  find(adapter: IAdapter, request: IRequest): Observable<Array<R>>
  save(adapter: IAdapter, request: IRequest): Observable<R>
  destroy(adapter: IAdapter, request: IRequest): Observable<R>
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
  applyHook: <I, O>(name: string, input: I) => Observable<O>;

  createRecord(data: IRequestData): R {
    return new this.recordConstructor(data);
  }

  create(adapter: IAdapter, request: IRequest): Observable<R> {
    return this.applyHook('beforeCreate', request)
      .flatMap(newRequest => adapter.create(this, newRequest))
      .flatMap(response => this.applyHook('afterCreate', response))
      .flatMap((response: IResponse) => Observable.of(_.isEmpty(response.data) ? null : this.createRecord(response.data)));
  }

  findOne(adapter: IAdapter, request: IRequest): Observable<R> {
    return this.applyHook('beforeFindOne', request)
      .flatMap(newRequest => adapter.findOne(this, newRequest))
      .flatMap(response => this.applyHook('afterFindOne', response))
      .flatMap((response: IResponse) => Observable.of(_.isEmpty(response.data) ? null : this.createRecord(response.data)));
  }

  find(adapter: IAdapter, request: IRequest): Observable<Array<R>> {
    return this.applyHook('beforeFind', request)
      .flatMap(newRequest => adapter.find(this, newRequest))
      .flatMap(response => this.applyHook('afterFind', response))
      .flatMap((response: IResponse) => {
        const values: IResponseData = response.data;
        if (Array.isArray(values)) {
          return Observable.of(values.map((value) => this.createRecord(value)));
        } else {
          return Observable.of([]);
        }
      });
  }

  save(adapter: IAdapter, request: IRequest): Observable<R> {
    return this.applyHook('beforeSave', request)
      .flatMap(newRequest => adapter.save(this, newRequest))
      .flatMap(response => this.applyHook('beforeSave', response))
      .flatMap((response: IResponse) => Observable.of(_.isEmpty(response.data) ? null : this.createRecord(response.data)));
  }

  destroy(adapter: IAdapter, request: IRequest): Observable<R> {
    return this.applyHook('beforeDestroy', request)
      .flatMap(newRequest => adapter.destroy(this, newRequest))
      .flatMap(response => this.applyHook('beforeDestroy', response))
      .flatMap((response: IResponse) => Observable.of(_.isEmpty(response.data) ? null : this.createRecord(response.data)));
  }
}
