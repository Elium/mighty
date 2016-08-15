import * as _ from "lodash";
import {IAdapter, IRequest, IResponse, IRequestData, IResponseData} from '../adapter/index';
import {IRecord, Record} from './record/index';
import {IMap} from '../../common/index';
import {ISchema} from './schema';
import {IRecordConstructor} from './record/record';
import {IPipe} from '../adapter/pipe/pipe';
import {RequestPipe} from '../adapter/pipe/request.pipe';
import {ResponsePipe} from '../adapter/pipe/response.pipe';
import {IStore} from '../store/store';
import {IRelation} from './relation/relation';
import {RelationFactory} from './relation/relation.factory';
import {HasOneRelation} from './relation/has-one.relation';
import {HasManyRelation} from './relation/has-many.relation';

export interface IResourceAdapter<T extends IRecord> {
  create(request: IRequest): Promise<T>
  findOne(request: IRequest): Promise<T>
  find(request: IRequest): Promise<Array<T>>
  save(request: IRequest): Promise<T>
  destroy(request: IRequest): Promise<T>

  requestPipe: IPipe<IRequest>
  responsePipe: IPipe<IResponse>
}

export interface IResource<T extends IRecord> extends IResourceAdapter<T> {
  adapter: IAdapter
  schema: ISchema
  relations: IMap<IRelation<any>>;

  initRelations(store: IStore);
  createRecord(data: IMap<any>): T
}

export class Resource<T extends IRecord> implements IResource<T> {
  protected _responsePipe: IPipe<IResponse>;
  protected _requestPipe: IPipe<IRequest>;
  protected _schema: ISchema;
  protected _adapter: IAdapter;
  protected _relations: IMap<IRelation<any>>;

  private _recordConstructor: IRecordConstructor;

  constructor(schema: ISchema, adapter: IAdapter, recordConstructor?: IRecordConstructor, requestPipe?: IPipe<IRequest>, responsePipe?: IPipe<IResponse>) {
    this._schema = schema;
    this._adapter = adapter;
    this._relations = {};
    this._recordConstructor = recordConstructor || <IRecordConstructor> Record;
    this._requestPipe = requestPipe || new RequestPipe();
    this._responsePipe = responsePipe || new ResponsePipe();
  }


  public createRecord(data: IRequestData): T {
    let record: T = <T> new this._recordConstructor(this, data);
    record = this._createRelationsRecords(record, data);
    return record;
  }


  public create(request: IRequest): Promise<T> {
    return this._adapter
      .create(this, this._requestPipe.create(request))
      .then((response: IResponse) => this._responsePipe.create(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  public findOne(request: IRequest): Promise<T> {
    return this._adapter
      .findOne(this, this._requestPipe.findOne(request))
      .then((response: IResponse) => this._responsePipe.findOne(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  public find(request: IRequest): Promise<Array<T>> {
    return this._adapter
      .find(this, this._requestPipe.find(request))
      .then((response: IResponse) => this._responsePipe.findOne(response))
      .then((response: IResponse) => {
        const values: IResponseData = response.data;
        if (Array.isArray(values)) {
          return values.map((value) => this.createRecord(value));
        } else {
          return [];
        }
      });
  }


  public save(request: IRequest): Promise<T> {
    return this._adapter
      .save(this, this._requestPipe.save(request))
      .then((response: IResponse) => this._responsePipe.save(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  public destroy(request: IRequest): Promise<T> {
    return this._adapter
      .destroy(this, this._requestPipe.destroy(request))
      .then((response: IResponse) => this._responsePipe.destroy(response))
      .then((response: IResponse) => _.isEmpty(response.data) ? null : this.createRecord(response.data));
  }


  public initRelations(store: IStore) {
    this._relations = <IMap<IRelation<any>>> {};
    if (this._schema.relations) {
      Object.keys(this._schema.relations).forEach((key) => {
        this._relations[key] = RelationFactory.create(store, key, this._schema.relations[key]);
      });
    }
  }


  public get relations(): IMap<IRelation<any>> {
    return this._relations;
  }


  public get adapter(): IAdapter {
    return this._adapter;
  }


  public get schema(): ISchema {
    return this._schema;
  }


  public get requestPipe(): IPipe<IRequest> {
    return this._requestPipe;
  }


  public get responsePipe(): IPipe<IResponse> {
    return this._responsePipe;
  }

  private _createRelationsRecords(record: T, data: IRequestData) {
    Object.keys(this._relations).forEach((key) => {
      const relation = this._relations[key];
      if (data.hasOwnProperty(relation.field)) {
        if (relation instanceof HasOneRelation) {
          record[relation.field] = relation.resource.createRecord(data[relation.field]);
        } else if (relation instanceof HasManyRelation && Array.isArray(data[relation.field])) {
          record[relation.field] = data[relation.field].map((item) => relation.resource.createRecord(item));
        }
      }
    });
    return record;
  }
}
