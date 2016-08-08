import * as _ from 'lodash';
import {ISchema} from '../schema';

export interface IProperty {
  name: string
  type: string
  value: any
  defaultValue?: any
}

export class Property implements IProperty {
  private _name: string;
  private _type: string;
  private _defaultValue: any;
  private _value: any;

  constructor(name: string, schema: ISchema, value?: any) {
    this._name = name;
    this._parseSchema(schema);
    this._value = value || this._defaultValue || null;
  }

  private _parseSchema(schema: ISchema) {
    this._type = _.get(schema, "type", "string");
    this._defaultValue = _.get(schema, "defaultsTo");
  }

  public get name(): string {
    return this._name;
  }

  public get type(): string {
    return this._type;
  }

  public get defaultValue(): any {
    return this._defaultValue;
  }

  public get value(): any {
    return this._value;
  }

  public set value(value: any) {
    // TODO implement validation
    this._value = value;
  }
}
