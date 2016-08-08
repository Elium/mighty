import {ISchema} from '../../src/core/resource/schema';
import {IRank} from './rank.data';
import {IRecord} from '../../src/core/resource/record/record';

export interface IHero {
  id: number
  name: string
  colors: Array<string>
  powers: Array<string>

  rankId: number
  rank?: IRank
}

export interface IHeroRecord extends IHero, IRecord {}

export class HeroData {
  schema: ISchema = {
    identity: "heroes",
    properties: {
      id: {
        type: "number"
      },
      name: {
        type: "string",
        defaultsTo: "hero"
      },
      powers: {
        type: "array",
        items: {type: "string"}
      },
      colors: {
        type: "array",
        items: {type: "string"}
      },
      rankId: {
        type: "number"
      }
    },
    relations: {
      rank: {
        type: "object",
        identity: "ranks",
        joinColumn: "rankId"
      }
    }
  };

  db: Array<IHero> = [
    {
      id: 1,
      name: "superman",
      powers: ["flight", "strength", "x-rays"],
      colors: ["red", "blue", "yellow"],
      rankId: 1
    },
    {
      id: 2,
      name: "batman",
      powers: ["technology"],
      colors: ["black", "grey"],
      rankId: 2
    },
    {
      id: 3,
      name: "ironman",
      powers: ["super armor"],
      colors: ["red", "yellow", "white"],
      rankId: 3
    }
  ];

  deadpool: IHero = {
    id: null,
    name: "Deadpool",
    powers: ["swag", "strength"],
    colors: ["red"],
    rankId: 2
  };
}
