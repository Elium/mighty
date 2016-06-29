import {IMap} from "../../common/utils/map";
import {IAdapter} from "../adapter/adapter";
import {IJsonSchema} from "../resource/schema";
import {IResource, Resource} from "../resource/resource";
import {IRecord} from "../resource/record/record";

export interface IStore {
  getResource(title: string): IResource<any>
  setResource(schema: IJsonSchema, adapter: IAdapter): IResource<any>
}


export class Store implements IStore {
  private _resources: IMap<IResource<any>>;

  constructor() {
    this._resources = {};
  }


  /**
   * @param title
   * @return {IResource} The instance if the resurce if it exists, undefined otherwise.
   */
  public getResource <T extends IRecord>(title: string): IResource<T> {
    return this._resources[title];
  }


  /**
   * Register a resource class in the store.
   * @param schema
   * @param adapter
   * @return {IResource}
   */
  public setResource <T extends IRecord>(schema: IJsonSchema, adapter: IAdapter): IResource<T> {
    const localResource = new Resource<T>(schema, adapter);
    this._resources[schema.title] = localResource;
    return localResource;
  }
}
