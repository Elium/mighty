import {Parser} from "../core/adapter/parser";
import {IResponse} from "../core/adapter/response";
import {IResource} from "../core/resource/resource";

export class HeroParser extends Parser {
  public create(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public find(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public save(resource: IResource, response: IResponse): IResponse {
    return response;
  }

  public destroy(resource: IResource, response: IResponse): IResponse {
    return response;
  }
}
