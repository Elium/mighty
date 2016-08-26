import {IMap} from '../utils/map';
import {IAdapter} from '../adapter/adapter';
import {IResource} from '../resource/resource';
import {IRecord} from '../resource/record';

export interface IStore {
  getAll (): IMap<IResource<IRecord,IAdapter>>
  get <R extends IRecord>(identity: string): IResource<R,IAdapter>
  set <R extends IRecord>(resource: IResource<R,IAdapter>)
}

export class Store implements IStore {
  private _resources: IMap<IResource<IRecord,IAdapter>>;
  
  constructor() {
    this._resources = {};
  }
  
  getAll(): IMap<IResource<IRecord,IAdapter>> {
    return this._resources;
  }
  
  get <R extends IRecord, A extends IAdapter>(identity: string): IResource<R,A> {
    return <IResource<R,A>> this._resources[identity];
  }
  
  set <R extends IRecord, A extends IAdapter>(resource: IResource<R,IAdapter>) {
    this._resources[resource.identity] = resource;
  }
}
