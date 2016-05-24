import {IXhrRequest} from "./xhr.request";
import {IFormatter} from "../formatter";
import {IResource} from "../../resource/resource";

export interface IHttpFormatter extends IFormatter {
  create(resource: IResource, request: IXhrRequest): IXhrRequest
  find(resource: IResource, request: IXhrRequest): IXhrRequest
  save(resource: IResource, request: IXhrRequest): IXhrRequest
  destroy(resource: IResource, request: IXhrRequest): IXhrRequest
}

export class HttpFormatter implements IHttpFormatter {

  public create(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public find(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public save(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public destroy(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }
}
