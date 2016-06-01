import {Formatter} from "../src/core/adapter/formatter";
import {IRequest} from "../src/core/adapter/request";
import {IResource} from "../src/core/resource/resource";

export class HeroFormatter extends Formatter {
  public create(resource: IResource, request: IRequest): IRequest {
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
