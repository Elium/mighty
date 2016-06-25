import * as HeroesData from "./hero.data";
import {Resource} from "../src/core/resource/resource";
import {HeroAdapter} from "./hero.adapter";
import {IJsonSchema} from "../src/core/resource/schema";
import {HeroRecord} from "./hero.record";
import {HeroRequestPipe} from "./hero.request.pipe";

const adapter = new HeroAdapter();
const heroesSchema: IJsonSchema = <IJsonSchema> HeroesData.schema;
const heroRequestPipe = new HeroRequestPipe();

export const resource = new Resource(heroesSchema, adapter, HeroRecord, heroRequestPipe);
