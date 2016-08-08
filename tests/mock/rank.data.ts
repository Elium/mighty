import {ISchema} from '../../src/core/resource/schema';
import {IRecord} from '../../src/core/resource/record/record';

export interface IRank {
  id: number
  name: string
}


export interface IRankRecord extends IRank, IRecord {}

export class RankData {
  schema: ISchema = {
    identity: "ranks",
    properties: {
      id: {
        type: "number"
      },
      name: {
        type: "string",
        defaultsTo: "God"
      }
    }
  };

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
