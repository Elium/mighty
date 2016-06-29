import * as _ from "lodash";
import {IAdapter, IRequest, IResponse, IRequestData, IResponseData} from "../adapter/index";
import {IRecord, Record} from "./record/index";
import {IMap} from "../../common/index";
import {IJsonSchema} from "./schema";
import {IRecordConstructor} from "./record/record";
import {IPipe} from "../pipe/pipe";
import {RequestPipe} from "../pipe/request.pipe";
import {ResponsePipe} from "../pipe/response.pipe";
import {Observable} from "rxjs/Rx";
import {ErrorObservable} from "rxjs/observable/ErrorObservable";

export interface IResourceAdapter {
  create(request: IRequest): Observable<IRecord>
  findOne(request: IRequest): Observable<IRecord>
  find(request: IRequest): Observable<Array<IRecord>>
  save(request: IRequest): Observable<IRecord>
  destroy(request: IRequest): Observable<IRecord>

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


  public create(request: IRequest): Observable<IRecord> {
    return this._adapter
      .create(this, this._requestPipe.create(request))
      .map((response: IResponse) => this._responsePipe.create(response))
      .map((response: IResponse) => this.createRecord(response.data));
  }


  public findOne(request: IRequest): Observable<IRecord> {
    return this._adapter
      .findOne(this, this._requestPipe.findOne(request))
      .map((response: IResponse) => this._responsePipe.findOne(response))
      .map((response: IResponse) => this.createRecord(response.data));
  }


  public find(request: IRequest): Observable<Array<IRecord>> {
    return this._adapter
      .find(this, this._requestPipe.find(request))
      .map((response: IResponse) => this._responsePipe.findOne(response))
      .map((response: IResponse) => {
        const values: IResponseData = response.data;
        if (_.isArray(values)) {
          return _.map(values, (value) => this.createRecord(value));
        } else {
          return [];
        }
      });
  }


  public save(request: IRequest): Observable<IRecord> {
    return this._adapter
      .save(this, this._requestPipe.save(request))
      .map((response: IResponse) => this._responsePipe.save(response))
      .map((response: IResponse) => this.createRecord(response.data));
  }


  public destroy(request: IRequest): Observable<IRecord> {
    return this._adapter
      .destroy(this, this._requestPipe.destroy(request))
      .map((response: IResponse) => this._responsePipe.destroy(response))
      .map((response: IResponse) => this.createRecord(response.data));
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
