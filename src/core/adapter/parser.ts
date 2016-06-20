import {IResponse} from "./response";
import {IResource} from "../resource/index";


export interface IParser {
  create(resource: IResource, response: IResponse): IResponse
  find(resource: IResource, response: IResponse): IResponse
  findOne(resource: IResource, response: IResponse): IResponse
  save(resource: IResource, response: IResponse): IResponse
  destroy(resource: IResource, response: IResponse): IResponse
}

export class Parser implements IParser {

  public create(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public find(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public findOne(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public save(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public destroy(resource: IResource, response: IResponse): IResponse {
    return response;
  }
}
