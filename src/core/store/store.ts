import {IMap} from '../../common/utils/map';
import {IAdapter} from '../adapter/adapter';
import {IResource, Resource} from '../resource/resource';
import {IRecord} from '../resource/record/record';
import {ISchema} from '../resource/schema';

export interface IStoreResource {
  schema: ISchema
  adapter: IAdapter
}

export interface IStore {
  getResource <T extends IRecord>(identity: string): IResource<T>
  setResource <T extends IRecord>(resource: IResource<T>)
  createResource <T extends IRecord>(schema: ISchema, adapter: IAdapter): IResource<T>
  getAllResource <T extends IRecord>(): IMap<IResource<T>>
  setup(storeResources: Array<IStoreResource>)
}


export class Store implements IStore {
  private _resources: IMap<IResource<any>>;

  constructor() {
    this._resources = {};
  }

  public getAllResource <T extends IRecord>(): IMap<IResource<T>> {
    return this._resources;
  }

  public getResource <T extends IRecord>(identity: string): IResource<T> {
    return this._resources[identity];
  }

  public setResource <T extends IRecord>(resource: IResource<T>) {
    this._resources[resource.schema.identity] = resource;
  }

  public createResource <T extends IRecord>(schema: ISchema, adapter: IAdapter): IResource<T> {
    return new Resource<T>(schema, adapter);
  }

  public setup(storeResources: Array<IStoreResource>) {
    storeResources.forEach((storeResource) => {
      this.setResource(this.createResource(storeResource.schema, storeResource.adapter))
    });

    Object.keys(this._resources).forEach((key) => {
      this._resources[key].initRelations(this)
    });
  }
}
