import {IRequest} from './request';
import {IResponse} from './response';
import {IRecord} from '../resource/record';
import {IResource} from '../resource/resource';

export interface IAdapter {
  create <R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>
  find <R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>
  findOne <R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>
  save <R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>
  destroy <R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>
}

export abstract class Adapter implements IAdapter {
  abstract create<R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>;
  abstract find<R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>;
  abstract findOne<R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>;
  abstract save<R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>;
  abstract destroy<R extends IRecord>(resource: IResource<R, this>, request: IRequest): Promise<IResponse>;
}
