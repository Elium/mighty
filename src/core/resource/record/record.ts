import {IResource} from '../resource';
import {IMap} from '../../../common/index';
import {IProperty, Property} from './property';

export interface IRecord {
  id: number
  properties: IMap<IProperty>
  [prop: string]: any
  
  toJSON(): Object
}

export interface IRecordConstructor {
  new (resource: IResource<any>, data?: IMap<any>): IRecord
}

export class Record implements IRecord {
  private _id: number;
  private _resource: IResource<this>;

  public properties: IMap<IProperty>;

  constructor(resource: IResource<any >, data?: IMap<any>) {
    this._resource = resource;

    this._initProperties();
    if (data) { this._initData(data); }
  }

  public get id(): number {
    return this._id;
  }

  public toJSON() {
    return Object.keys(this.properties).reduce((result, key) => {
      result[key] = this.properties[key].value;
      return result;
    }, {});
  }

  private _initProperties() {
    this.properties = <IMap<IProperty>> {};
    Object.keys(this._resource.schema.properties).forEach((key) => {
      this.properties[key] = new Property(key, this._resource.schema.properties[key]);
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: false,
        get: () => this.properties[key].value,
        set: (value) => this.properties[key].value = value
      });
    });
  }

  private _initData(data: IMap<any>) {
    Object.keys(data).forEach((key) => {
      if (this.properties.hasOwnProperty(key)) {
        this.properties[key].value = data[key];
      }
    });
  }
}
