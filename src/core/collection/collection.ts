import * as _ from "lodash";

export interface ICollection<T> {
  add(element: T): T
  remove(element: T): T
  get(index: number): T
  length: number
}

export class Collection<T> implements ICollection<T> {
  private _dataset: Array<T>;
  
  constructor(data: Array<T>) {
    this._dataset = new Array<T>();
    
    if (_.isArray(data) && !_.isEmpty(data)) {
      _.forEach(data, (record: T) => {
        this.add(record);
      });
    }
  }
  
  
  public add(element: T): T {
    var index = this._dataset.push(element);
    return this._dataset[index];
  }
  
  
  public remove(element: T): T {
    var index = this._dataset.indexOf(element);
    if (index > -1) {
      return this._dataset.splice(index, 1)[0];
    }
    return;
  }
  
  
  public get(index: number): T {
    if (-1 < index && index < this._dataset.length) {
      return this._dataset[index];
    } else {
      throw Error("Collection#get : " + index + " not in range.");
    }
  }
  
  
  public get length(): number {
    return this._dataset.length;
  }
}
