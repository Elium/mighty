import {IFormatter} from "./formatter";
import {IParser} from "./parser";
import {IRequest} from "./request";
import {IResource} from "../resource";
import {IResponse} from "./response";

export interface IAdapter {
  create(resource: IResource, request: IRequest): Promise<IResponse>
  find(resource: IResource, request: IRequest): Promise<IResponse>
  save(resource: IResource, request: IRequest): Promise<IResponse>
  destroy(resource: IResource, request: IRequest): Promise<IResponse>

  formatter: IFormatter
  parser: IParser
}

export abstract class Adapter implements IAdapter {
  protected _formatter: IFormatter;
  protected _parser: IParser;

  constructor(formatter?: IFormatter, parser?: IParser) {
    this._formatter = formatter;
    this._parser = parser;
  }

  abstract create(resource: IResource, request: IRequest): Promise<IResponse>
  
  abstract find(resource: IResource, request: IRequest): Promise<IResponse>

  abstract save(resource: IResource, request: IRequest): Promise<IResponse>

  abstract destroy(resource: IResource, request: IRequest): Promise<IResponse>


  public get formatter(): IFormatter {
    return this._formatter;
  }

  public get parser(): IParser {
    return this._parser;
  }
}
