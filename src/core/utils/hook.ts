import * as _ from 'lodash'
import {applyMixins} from './mixins'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/mergeMap'


export interface IHook {
  name: string
  map: <I, O> (input: I) => Observable<I | O>
}

export class Hook implements IHook {
  name: string
  map: <I, O> (input: I) => Observable<O>
  
  constructor(name: string, action: <I, O> (input: I) => Observable<I | O>) {
    this.name = name
    this.map = action
  }
}

export interface IHookable {
  addHook(hook: IHook)
  removeHook(hook: IHook)
  applyHook<I, O>(name: string, input: I): Observable<I | O>
}

export function hookable(constructor: Function) {
  applyMixins(constructor, [Hookable])
}

export class Hookable implements IHookable {
  hooks: Array<IHook>
  
  constructor() {
    this.hooks = []
  }
  
  addHook(hook: IHook) {
    const existingHook = _.find(this.hooks, {
      name: hook.name,
      map: hook.map
    })
    
    if (!_.isEmpty(existingHook)) {
      existingHook.map = hook.map
    } else {
      this.hooks.push(hook)
    }
  }
  
  removeHook(hook: IHook) {
    _.remove(this.hooks, {name: hook.name, map: hook.map})
  }
  
  applyHook<I, O>(name: string, input: I): Observable<I | O> {
    const hooks = _.filter(this.hooks, {name: name})
    let source = Observable.of(input)
    _.forEach(hooks, (hook: IHook) => {
      if (_.isFunction(hook.map)) {
        source = source.flatMap(input => hook.map(input))
      }
    })
    return source
  }
}
