import * as HeroesData from "./hero.data";
import {Resource} from "../src/core/resource/resource";
import {HeroAdapter} from "./hero.adapter";
import {IJsonSchema} from "../src/core/resource/schema";
import {HeroRecord, IHeroRecord} from "./hero.record";

export const adapter = new HeroAdapter();
export const schema: IJsonSchema = <IJsonSchema> HeroesData.schema;
export const resource = new Resource<IHeroRecord>(schema, adapter, HeroRecord);
