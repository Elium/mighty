import {IMap} from "../../common/utils/map";
import {IAdapter} from "../adapter/adapter";
import {IJsonSchema} from "../resource/schema";
import {IResource, Resource} from "../resource/resource";

export interface IStore {
  getResource(title: string): IResource
  setResource(schema: IJsonSchema, adapter: IAdapter): IResource
}


export class Store implements IStore {
  private _resources: IMap<IResource>;
  
  constructor() {
    this._resources = {};
  }
  
  
  /**
   * @param title
   * @return {IResource} The instance if the resurce if it exists, undefined otherwise.
   */
  public getResource(title: string): IResource {
    return this._resources[title];
  }
  
  
  /**
   * Register a resource class in the store.
   * @param schema
   * @param adapter
   * @return {IResource}
   */
  public setResource(schema: IJsonSchema, adapter: IAdapter): IResource {
    var localResource: IResource = new Resource(schema, adapter);
    this._resources[schema.title] = localResource;
    return localResource;
  }
}
