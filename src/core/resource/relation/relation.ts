import {IRecord} from '../record/record';
import {RelationType, ISchemaRelation} from '../schema';
import {IResource} from '../resource';

export interface IRelation<T extends IRecord> {
  field: string;
  type: RelationType;
}

export abstract class Relation<T extends IRecord> implements IRelation<T> {
  public field: string;
  public type: RelationType;

  public _resource: IResource<T>;

  constructor(resource: IResource<T>, field: string, schemaRelation: ISchemaRelation) {
    this._resource = resource;
    this.field = field;
    this.type = schemaRelation.type;
  }

  public get resource(): IResource<T> {
    return this._resource;
  }
}
