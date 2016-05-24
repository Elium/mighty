import {Formatter} from "../core/adapter/formatter";
import {IRequest} from "../core/adapter/request";
import {IResource} from "../core/resource/resource";

export class HeroFormatter extends Formatter {
  public create(resource: IResource, request: IRequest): IRequest {
    return request;
  }
  
  public findOne(resource: IResource, request: IRequest): IRequest {
    return request;
  }
  
  public find(resource: IResource, request: IRequest): IRequest {
    return request;
  }
  
  public save(resource: IResource, request: IRequest): IRequest {
    return request;
  }
  
  public destroy(resource: IResource, request: IRequest): IRequest {
    return request;
  }
}
