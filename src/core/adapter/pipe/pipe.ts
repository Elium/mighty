export interface IPipe<T> {
  create(value: T): T
  find(value: T): T
  findOne(value: T): T
  save(value: T): T
  destroy(value: T): T
}

export abstract class Pipe<T> implements IPipe<T> {
  abstract create(value: T): T;

  abstract find(value: T): T;

  abstract findOne(value: T): T;

  abstract save(value: T): T;

  abstract destroy(value: T): T;
}
