import * as _ from "lodash";
import {IResource} from "../resource";
import {IMap} from "../../../common";
import {IRequestData} from "../../adapter/request";
import {IProperty, Property} from "./property";

export interface IRecord {
  id: string
  name: string
  properties: IMap<IProperty>
  [prop: string]: any

  save(): Promise<IRecord>
  destroy(): Promise<IRecord>
}


export class Record implements IRecord {
  private _id: string;
  private _resource: IResource;

  public name: string;
  public properties: IMap<IProperty>;

  constructor(resource: IResource, data?: IRequestData) {
    this._resource = resource;
    if (_.isUndefined(resource)) {
      throw Error("Resource should not be empty");
    }

    this._initProperties();

    if (data) {
      this._initData(<IMap<any>> data);
    }
  }

  public get id(): string {
    return this._id;
  }

  public save(): Promise<IRecord> {
    // TODO create if no id, save otherwise
    return this._resource.save({}, {});
  }

  public destroy(): Promise<IRecord> {
    // TODO destroy with id if possible
    return this._resource.destroy({});
  }


  /**
   * Init the record properties.
   * @private
   */
  private _initProperties() {
    var schema = this._resource.schema;
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
