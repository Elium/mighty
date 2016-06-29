import {Record, IRecord} from "../src/core/resource/record/record";

export interface IHeroRecord extends IRecord {
  powers: Array<string>
  colors: Array<string>
}

export class HeroRecord extends Record {

  public toString(): string {
    return "I'm a hero record !";
  }
}
