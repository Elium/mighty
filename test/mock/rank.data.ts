import {IRecord, Record} from '../../src/resource/record';
import {IMap} from '../../src/utils/map';

export interface IRank {
  id: number
  name: string
}

export class RankRecord extends Record implements IRank, IRecord {
  id: number;
  name: string;
  
  toJSON(): Object {
    return {
      id: this.id,
      name: this.name
    }
  }
  
  parseData(data: IMap<any>) {
    this.id = data["id"] || null;
    this.name = data["name"] || null;
  }
}

export class RankData {
  db: Array<IRank> = [
    {
      id: 1,
      name: "god"
    },
    {
      id: 2,
      name: "master"
    },
    {
      id: 3,
      name: "emperor"
    }
  ];
}
