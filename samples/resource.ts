import {Resource} from '../src/core/resource/resource';
import {IRecord} from '../src/core/resource/record/record';
import {SampleAdapter} from './adapter';
import {heroSchema} from './schema';

export interface IHero extends IRecord {
  id: number;
  name: string;
}

const adapter = new SampleAdapter();
export const heroResource = new Resource<IHero>(heroSchema, adapter);
