import {Parser} from "../src/core/adapter/parser";
import {IResponse} from "../src/core/adapter/response";
import {IResource} from "../src/core/resource/resource";

export class HeroParser extends Parser {
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
