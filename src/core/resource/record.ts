import {IMap} from '../utils/map'

export interface IRecord {
  toJSON(): Object
  parseData(data: IMap<any>)
}

export interface IRecordConstructor<R extends IRecord> {
  new (data?: IMap<any>): R
}

export abstract class Record implements IRecord {
  constructor(data?: IMap<any>) {
    if (data) {
      this.parseData(data)
    }
  }
  
  abstract toJSON();
  
  abstract parseData(data: IMap<any>);
}
