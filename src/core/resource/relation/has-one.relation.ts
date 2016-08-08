import {IRecord} from '../record/record';
import {IRelation, Relation} from './relation';
import {IResource} from '../resource';
import {ISchemaRelation} from '../schema';

export interface IHasOneRelation<T extends IRecord> extends IRelation<T> {
  joinColumn: string;
}

export class HasOneRelation<T extends IRecord> extends Relation<T> implements IHasOneRelation<T> {
  private _joinColumn: string;

  constructor(resource: IResource<T>, field: string, schemaRelation: ISchemaRelation) {
    super(resource, field, schemaRelation);
    this._joinColumn = schemaRelation.joinColumn;
  }

  public get joinColumn(): string {
    return this._joinColumn;
  }
}
