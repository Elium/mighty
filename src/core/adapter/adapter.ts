import {IRequest} from './request';
import {IResource} from '../resource/index';
import {IResponse} from './response';

export interface IAdapter {
  create (resource: IResource<any>, request: IRequest): Promise<IResponse>
  find (resource: IResource<any>, request: IRequest): Promise<IResponse>
  findOne (resource: IResource<any>, request: IRequest): Promise<IResponse>
  save (resource: IResource<any>, request: IRequest): Promise<IResponse>
  destroy (resource: IResource<any>, request: IRequest): Promise<IResponse>
}

export abstract class Adapter implements IAdapter {
  abstract create(resource: IResource<any>, request: IRequest): Promise<IResponse>;

  abstract find(resource: IResource<any>, request: IRequest): Promise<IResponse>;

  abstract findOne(resource: IResource<any>, request: IRequest): Promise<IResponse>;

  abstract save(resource: IResource<any>, request: IRequest): Promise<IResponse>;

  abstract destroy(resource: IResource<any>, request: IRequest): Promise<IResponse>;

  protected abstract _populate(resource: IResource<any>, request: IRequest, response: IResponse): Promise<IResponse>;
}
