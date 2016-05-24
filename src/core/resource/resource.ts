import * as _ from "lodash";
import {ICollection, Collection} from "../collection";
import {IAdapter, IRequest, Request, IResponse} from "../adapter";
import {IRecord, Record} from "./record";
import {IMap} from "../../common";
import {IRequestData} from "../adapter/request";
import {IJsonSchema} from "./schema";
import {IResponseData} from "../adapter/response";

export interface IResourceAdapter {
  create(request: IRequest): Promise<IRecord>
  find(request: IRequest): Promise<ICollection<IRecord>>
  save(request: IRequest): Promise<IRecord>
  destroy(request: IRequest): Promise<IRecord>
}

export interface IResource extends IResourceAdapter {
  adapter: IAdapter
  schema: IJsonSchema

  createRecord(data: IMap<any>): IRecord
}

export class Resource implements IResource {
  private _adapter: IAdapter;
  private _schema: IJsonSchema;

  constructor(schema: IJsonSchema, adapter?: IAdapter) {
    this._schema = schema;
    this._adapter = adapter;
  }

  /**
   * Create a record instance.
   * @param data
   * @returns {Record}
   */
  public createRecord(data: IRequestData): IRecord {
    return new Record(this, data);
  }


  public create(request: IRequest): Promise<IRecord> {
    return this._adapter
      .create(this, request)
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }


  public find(request: IRequest): Promise<ICollection<IRecord>> {
    return this._adapter
      .find(this, request)
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
      .save(this, request)
      .then((response: IResponse) => {
        return this.createRecord(response.data);
      });
  }


  public destroy(request: IRequest): Promise<IRecord> {
    return this._adapter
      .destroy(this, request)
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
}
