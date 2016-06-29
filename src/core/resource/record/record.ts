import * as _ from "lodash";
import {IResource} from "../resource";
import {IMap} from "../../../common/index";
import {IProperty, Property} from "./property";
import {Observable} from "rxjs/Rx";
import {Request} from "../../adapter/request";

export interface IRecord {
  id: string
  name: string
  properties: IMap<IProperty>
  [prop: string]: any

  save(): Observable<this>
  destroy(): Observable<this>
}

export interface IRecordConstructor {
  new (resource: IResource<any>, data?: IMap<any>): IRecord
}

export class Record implements IRecord {
  private _id: string;
  private _resource: IResource<any>;

  public name: string;
  public properties: IMap<IProperty>;

  constructor(resource: IResource<any>, data?: IMap<any>) {
    this._resource = resource;
    if (_.isUndefined(resource)) {
      throw Error("Resource should not be empty");
    }

    this._initProperties();

    if (data) { this._initData(data); }
  }

  public get id(): string {
    return this._id;
  }

  public save(): Observable<this> {
    return this._resource.save(new Request({data: this.properties}));
  }

  public destroy(): Observable<this> {
    return this._resource.destroy(new Request({
      criteria: {id: this._id},
      data: this.properties
    }));
  }


  /**
   * Init the record properties.
   * @private
   */
  private _initProperties() {
    const schema = this._resource.schema;
    this.name = schema.title;
    this.properties = <IMap<IProperty>> {};
    _.forEach(schema.properties, (value, key) => {
      this.properties[key] = new Property(key, value);
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: false,
        get: () => this.properties[key].value,
        set: (value) => this.properties[key].value = value
      });
    });
  }


  /**
   * Init the data.
   * @param data
   * @private
   */
  private _initData(data: IMap<any>) {
    _.forEach(data, (value, key) => {
      if (this.properties.hasOwnProperty(key)) {
        this.properties[key].value = value;
      }
    });
  }
}
