import {IRequest} from "./request";
import {IResource} from "../resource/index";
import {IResponse} from "./response";

export interface IAdapter {
  create(resource: IResource, request: IRequest): Promise<IResponse>
  find(resource: IResource, request: IRequest): Promise<IResponse>
  findOne(resource: IResource, request: IRequest): Promise<IResponse>
  save(resource: IResource, request: IRequest): Promise<IResponse>
  destroy(resource: IResource, request: IRequest): Promise<IResponse>
}

export abstract class Adapter implements IAdapter {
  abstract create(resource: IResource, request: IRequest): Promise<IResponse>
  abstract find(resource: IResource, request: IRequest): Promise<IResponse>
  abstract findOne(resource: IResource, request: IRequest): Promise<IResponse>
  abstract save(resource: IResource, request: IRequest): Promise<IResponse>
  abstract destroy(resource: IResource, request: IRequest): Promise<IResponse>
}
