import * as _ from 'lodash'
import {Record, IRecord} from '../../src/core/resource/record'
import {IMap} from '../../src/core/utils/map'

export interface IRank {
  id: number
  name: string
}

export class Rank extends Record implements IRank, IRecord {
  id: number
  name: string
  
  toJSON(): Object {
    return {
      id: this.id,
      name: this.name
    }
  }
  
  parseData(data: IMap<any>) {
    this.id = data["id"] || null
    this.name = data["name"] || null
  }
}

export class RankData {
  db = _.map([
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
  ], rank => new Rank(rank))
}
