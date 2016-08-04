/**
 * Data types :
 *
 * Data     Type            Usage  Description
 * String   type: 'string'  Any string.
 * Number   type: 'number'  Any number
 * Boolean  type: 'boolean' true or false
 * JSON     type: 'json'    Any JSON-serializable value, including numbers, booleans, strings, arrays, dictionaries, and null.
 * Array    type: 'array'   Any array consisting solely of JSON-serializable contents.
 */

export type RelationType = 'object' | 'array';
export type PropertyType = 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';

export interface ISchema {
  identity?: string;
  properties?: {[property: string]: ISchemaProperty};
  relations?: {[property: string]: ISchemaRelation};
}

export interface ISchemaProperty {
  type: PropertyType;
  items?: ISchemaProperty;
  defaultsTo?: any;
  primaryKey?: boolean;
  required?: boolean;
}

export interface ISchemaRelation {
  type: RelationType;
  identity: string;
  viaColumn?: string;
  joinColumn?: string;
}
