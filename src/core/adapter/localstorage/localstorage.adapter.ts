import {IParser} from "../parser";
import {IFormatter} from "../formatter";
import {Adapter} from "../adapter";
import {LocalStorageFormatter} from "./localstorage.formatter";
import {LocalStorageParser} from "./localstorage.parser";
import {IResponse} from "../response";
import {IRequest} from "../request";
import {IResource} from "../../resource/resource";

export class LocalStorageAdapter extends Adapter {

  public constructor(formatter?: IFormatter, parser?: IParser) {
    super(formatter, parser);

    if (!formatter && !parser) {
      this._formatter = new LocalStorageFormatter();
      this._parser = new LocalStorageParser();
    }
  }

  create(resource: IResource, request: IRequest): Promise<IResponse> {
    return;
  }

  find(resource: IResource, request: IRequest): Promise<IResponse> {
    return;
  }

  save(resource: IResource, request: IRequest): Promise<IResponse> {
    return;
  }

  destroy(resource: IResource, request: IRequest): Promise<IResponse> {
    return;
  }
}
