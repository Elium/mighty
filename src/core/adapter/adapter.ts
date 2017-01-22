import {IRequest} from './request';
import {IResponse} from './response';
import {IRecord} from '../resource/record';
import {IResource} from '../resource/resource';
import {Observable} from 'rxjs/Observable';

export interface IAdapter {
  create <R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>
  find <R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>
  findOne <R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>
  save <R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>
  destroy <R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>
}

export abstract class Adapter implements IAdapter {
  abstract create<R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>;
  abstract find<R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>;
  abstract findOne<R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>;
  abstract save<R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>;
  abstract destroy<R extends IRecord>(resource: IResource<R>, request: IRequest): Observable<IResponse>;
}
