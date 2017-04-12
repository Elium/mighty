import * as _ from 'lodash'
import {IHero} from './hero.data'
import {IAdapter, Adapter} from '../../src/core/adapter/adapter'
import {IResource} from '../../src/core/resource/resource'
import {IRequest} from '../../src/core/adapter/request'
import {IResponse, Response} from '../../src/core/adapter/response'
import {Observable} from 'rxjs/Observable'
import 'rxjs/observable/of'

export interface IMockAdapter extends IAdapter {
  heroes: Array<IHero>
}

export class MockAdapter extends Adapter implements IMockAdapter {
  public heroes: Array<IHero>
  
  constructor(heroes: Array<IHero>) {
    super()
    this.heroes = heroes
  }
  
  create(resource: IResource<IHero>, request: IRequest): Observable<IResponse> {
    const id = this._getMaxId(this.heroes)
    const data = _.merge({}, <IHero> request.data, {id: id + 1})
    this.heroes.push(data)
    return Observable.of(new Response({data: data}))
  }
  
  
  findOne(resource: IResource<IHero>, request: IRequest): Observable<IResponse> {
    const hero = _.find(this.heroes, request.criteria)
    return Observable.of(new Response({data: _.isEmpty(hero) ? null : _.cloneDeep(hero)}))
  }
  
  
  find(resource: IResource<IHero>, request: IRequest): Observable<IResponse> {
    const heroes = _.filter(this.heroes, request.criteria)
    return Observable.of(new Response({data: _.cloneDeep(heroes)}))
  }
  
  
  save(resource: IResource<IHero>, request: IRequest): Observable<IResponse> {
    const index = _.findIndex(this.heroes, request.criteria)
    if (index < 0) {
      return Observable.throw(new Response({error: new Error("There is no match for this hero criteria")}))
    } else {
      this.heroes.splice(index, 1, <IHero> request.data)
      return Observable.of(new Response({data: <IHero> _.cloneDeep(request.data)}))
    }
  }
  
  
  destroy(resource: IResource<IHero>, request: IRequest): Observable<IResponse> {
    const index = _.findIndex(this.heroes, request.criteria)
    if (index < 0) {
      return Observable.throw(new Response({error: new Error("There is no match for this hero criteria")}))
    } else {
      const hero = _.first(this.heroes.splice(index, 1))
      return Observable.of(new Response({data: hero}))
    }
  }
  
  private _getMaxId(heroes: Array<IHero>): number {
    const ids: Array<number> = _.map(heroes, (hero) => hero.id)
    return _.max(ids)
  }
}
