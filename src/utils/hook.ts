import * as _ from 'lodash';
import {applyMixins} from './mixins';

export interface IHook {
  name: string
  map: <I, O> (input: I) => Promise<I | O>
}

export class Hook implements IHook {
  name: string;
  map: <I, O> (input: I) => Promise<O>;

  constructor(name: string, action: <I, O> (input: I) => Promise<I | O>) {
    this.name = name;
    this.map = action;
  }
}

export interface IHookable {
  addHook(hook: IHook)
  removeHook(name: string)
  applyHook<I, O>(name: string, input: I): Promise<I | O>
}

export function hookable(constructor: Function) {
  applyMixins(constructor, [Hookable]);
}

export class Hookable implements IHookable {
  hooks: Array<IHook> = [];

  addHook(hook: IHook) {
    const existingHook = _.find(this.hooks, {name: hook.name});
    if(!_.isEmpty(existingHook)) {
      existingHook.map = hook.map;
    } else {
      this.hooks.push(hook);
    }
  }

  removeHook(name: string) {
    _.remove(this.hooks, {name: name});
  }

  applyHook<I, O>(name: string, input: I): Promise<I | O> {
    const hook = _.find(this.hooks, {name: name});
    if(_.isEmpty(hook)|| !_.isFunction(hook.map)) {
      return Promise.resolve(input);
    } else {
      return hook.map(input);
    }
  }
}
