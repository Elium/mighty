import {IRecord} from '../record/record';
import {IStore} from '../../store/store';
import {ISchemaRelation} from '../schema';
import {IRelation} from './relation';
import {HasOneRelation} from './has-one.relation';
import {HasManyRelation} from './has-many.relation';

export class RelationFactory {

  public static create<T extends IRecord>(store: IStore, field: string, schemaRelation: ISchemaRelation): IRelation<T> {
    const relatedResource = store.getResource<T>(schemaRelation.identity);
    switch (schemaRelation.type) {
      case 'object':
        return new HasOneRelation<T>(relatedResource, field, schemaRelation);
      case 'array':
        return new HasManyRelation<T>(relatedResource, field, schemaRelation);
      default:
        throw new Error(`Unkown relation type ${schemaRelation.type}`);
    }
  }
}
