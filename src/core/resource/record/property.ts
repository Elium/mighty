import * as _ from "lodash";
import {IJsonSchema} from "../schema";

export interface IProperty {
  name: string
  type: string
  value: any
  default?: any
}

export class Property implements IProperty {
  private _name: string;
  private _type: string;
  private _default: any;
  private _value: any;
  
  constructor(name: string, schema: IJsonSchema, value?: any) {
    this._name = name;
    this._parseSchema(schema);
    this._value = value || this._default || null;
  }
  
  private _parseSchema(schema: IJsonSchema) {
    this._type = _.get(schema, "type", "string");
    this._default = _.get(schema, "default", null);
  }
  
  public get name(): string {
    return this._name;
  }
  
  public get type(): string {
    return this._type;
  }
  
  public get default(): any {
    return this._default;
  }
  
  public get value(): any {
    return this._value;
  }
  
  public set value(value: any) {
    // TODO implement validation
    this._value = value;
  }
}
