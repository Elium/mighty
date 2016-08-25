import {IRank} from './rank.data';
import {IRecord, Record} from '../../src/resource/record';
import {IMap} from '../../src/utils/map';

export interface IHero {
  id: number
  name: string
  colors: Array<string>
  powers: Array<string>
  
  rankId: number
  rank?: IRank
}

export class HeroRecord extends Record implements IHero, IRecord {
  id: number;
  name: string;
  colors: Array<string>;
  powers: Array<string>;
  rankId: number;
  rank: IRank;
  
  toJSON(): Object {
    return {
      id: this.id,
      name: this.name,
      colors: this.colors,
      powers: this.powers,
      rankId: this.rankId
    }
  }
  
  parseData(data: IMap<any>) {
    this.id = data["id"] || null;
    this.name = data["name"] || null;
    this.colors = data["colors"] || [];
    this.powers = data["powers"] || [];
    this.rankId = data["rankId"] || null;
  }
}

export class HeroData {
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
