import {IMap} from '../utils/map';
import {IResource} from '../resource/resource';
import {IRecord} from '../resource/record';

export interface IStore {
  getAll (): IMap<IResource<IRecord>>
  get <R extends IRecord>(identity: string): IResource<R>
  set <R extends IRecord>(resource: IResource<R>)
}

export class Store implements IStore {
  private _resources: IMap<IResource<IRecord>>;

  constructor() {
    this._resources = {};
  }

  getAll(): IMap<IResource<IRecord>> {
    return this._resources;
  }

  get <R extends IRecord>(identity: string): IResource<R> {
    return <IResource<R>> this._resources[identity];
  }

  set <R extends IRecord>(resource: IResource<R>) {
    this._resources[resource.identity] = resource;
  }
}
