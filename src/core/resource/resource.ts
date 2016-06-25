import * as _ from "lodash";
import {ICollection, Collection} from "../collection/index";
import {IAdapter, IRequest, IResponse, IRequestData, IResponseData} from "../adapter/index";
import {IRecord, Record} from "./record/index";
import {IMap} from "../../common/index";
import {IJsonSchema} from "./schema";
import {IRecordConstructor} from "./record/record";
import {IPipe} from "../pipe/pipe";
import {RequestPipe} from "../pipe/request.pipe";
import {ResponsePipe} from "../pipe/response.pipe";

export interface IResourceAdapter {
  create(request: IRequest): Promise<IRecord>
  findOne(request: IRequest): Promise<IRecord>
  find(request: IRequest): Promise<ICollection<IRecord>>
  save(request: IRequest): Promise<IRecord>
  destroy(request: IRequest): Promise<IRecord>
  
  requestPipe: IPipe<IRequest>
  responsePipe: IPipe<IResponse>
}

export interface IResource extends IResourceAdapter {
  adapter: IAdapter
  schema: IJsonSchema
  
  createRecord(data: IMap<any>): IRecord
}

export class Resource implements IResource {
  protected _responsePipe: IPipe<IResponse>;
  protected _requestPipe: IPipe<IRequest>;
  
  private _adapter: IAdapter;
  private _schema: IJsonSchema;
  private _recordConstructor: IRecordConstructor;
  
  constructor(schema: IJsonSchema, adapter: IAdapter, recordConstructor?: IRecordConstructor, requestPipe?: IPipe<IRequest>, responsePipe?: IPipe<IResponse>) {
    this._schema = schema;
    this._adapter = adapter;
    this._recordConstructor = recordConstructor || Record;
    this._requestPipe = requestPipe || new RequestPipe();
    this._responsePipe = responsePipe || new ResponsePipe();
  }
  
  /**
   * Create a record instance.
   * @param data
   * @returns {Record}
   */
  public createRecord(data: IRequestData): IRecord {
    return new this._recordConstructor(this, data);
  }
  
  
  public create(request: IRequest): Promise<IRecord> {
    return this._adapter
      .create(this, this._requestPipe.create(request))
      .then((response: IResponse) => this._responsePipe.create(response))
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }
  
  
  public findOne(request: IRequest): Promise<IRecord> {
    return this._adapter
      .findOne(this, this._requestPipe.findOne(request))
      .then((response: IResponse) => this._responsePipe.findOne(response))
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }
  
  
  public find(request: IRequest): Promise<ICollection<IRecord>> {
    return this._adapter
      .find(this, this._requestPipe.find(request))
      .then((response: IResponse) => this._responsePipe.findOne(response))
      .then((response: IResponse) => {
        const values: IResponseData = response.data;
        if (_.isArray(values)) {
          const records = _.map(values, (value) => this.createRecord(value));
          return new Collection<IRecord>(records);
        } else {
          return Promise.reject<Collection<IRecord>>(new Error("Expected result must be an array"));
        }
      });
  }
  
  
  public save(request: IRequest): Promise<IRecord> {
    return this._adapter
      .save(this, this._requestPipe.save(request))
      .then((response: IResponse) => this._responsePipe.save(response))
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }
  
  
  public destroy(request: IRequest): Promise<IRecord> {
    return this._adapter
      .destroy(this, this._requestPipe.destroy(request))
      .then((response: IResponse) => this._responsePipe.destroy(response))
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }
  
  public get adapter(): IAdapter {
    return this._adapter;
  }
  
  public get schema(): IJsonSchema {
    return this._schema;
  }
  
  public get requestPipe(): IPipe<IRequest> {
    return this._requestPipe;
  }
  
  public get responsePipe(): IPipe<IResponse> {
    return this._responsePipe;
  }
}
