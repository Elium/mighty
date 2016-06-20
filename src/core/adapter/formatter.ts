import {IRequest} from "./request";
import {IResource} from "../resource/index";

export interface IFormatter {
  create(resource: IResource, request: IRequest): IRequest
  find(resource: IResource, request: IRequest): IRequest
  findOne(resource: IResource, request: IRequest): IRequest
  save(resource: IResource, request: IRequest): IRequest
  destroy(resource: IResource, request: IRequest): IRequest
}

export class Formatter implements IFormatter {

  public create(resource: IResource, request: IRequest): IRequest {
    return request;
  }

  public find(resource: IResource, request: IRequest): IRequest {
    return request;
  }

  public findOne(resource: IResource, request: IRequest): IRequest {
    return request;
  }

  public save(resource: IResource, request: IRequest): IRequest {
    return request;
  }

  public destroy(resource: IResource, request: IRequest): IRequest {
    return request;
  }
}
