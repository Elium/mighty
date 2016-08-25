import {IMap} from '../utils/map';
import {IAdapter} from '../adapter/adapter';
import {IResource} from '../resource/resource';
import {IRecord} from '../resource/record';

export interface IStore<A extends IAdapter> {
  getAll(): IMap<IResource<IRecord,A>>
  get <R extends IRecord>(identity: string): IResource<R,A>
  set <R extends IRecord>(resource: IResource<R,A>)
}

export class Store<A extends IAdapter> implements IStore<A> {
  private _resources: IMap<IResource<IRecord,A>>;
  
  constructor() {
    this._resources = {};
  }
  
  getAll(): IMap<IResource<IRecord,A>> {
    return this._resources;
  }
  
  get <R extends IRecord>(identity: string): IResource<R,A> {
    return <IResource<R,A>> this._resources[identity];
  }
  
  set <R extends IRecord>(resource: IResource<R,A>) {
    this._resources[resource.identity] = resource;
  }
}
