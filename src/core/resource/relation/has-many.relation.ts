import {IRecord} from '../record/record';
import {IRelation, Relation} from './relation';
import {IResource} from '../resource';
import {ISchemaRelation} from '../schema';

export interface IHasManyRelation<T extends IRecord> extends IRelation<T> {
  viaColumn: string;
}

export class HasManyRelation<T extends IRecord> extends Relation<T> implements IHasManyRelation<T> {
  private _viaColumn: string;

  constructor(resource: IResource<T>, field: string, schemaRelation: ISchemaRelation) {
    super(resource, field, schemaRelation);
    this._viaColumn = schemaRelation.viaColumn;
  }

  public get viaColumn(): string {
    return this._viaColumn;
  }
}
