import * as _ from 'lodash';
import {IHero} from './hero.data';
import {Adapter, IAdapter} from '../../src/adapter/adapter';
import {IResponse, Response} from '../../src/adapter/response';
import {IRequest} from '../../src/adapter/request';
import {IResource} from '../../src/resource/resource';
import {IRecord} from '../../src/resource/record';

export interface IMockAdapter extends IAdapter {
  heroes: Array<IHero>
}

export class MockAdapter extends Adapter implements IMockAdapter {
  public heroes: Array<IHero>;
  
  constructor(heroes: Array<IHero>) {
    super();
    this.heroes = heroes;
  }
  
  create(resource: IResource<IHero & IRecord, this>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const id = this._getMaxId(this.heroes);
      const data = _.merge({}, <IHero> request.data, {id: id + 1});
      this.heroes.push(data);
      resolve(new Response({data: data}));
    });
  }
  
  
  findOne(resource: IResource<IHero & IRecord, this>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const hero = _.find(this.heroes, request.criteria);
      resolve(new Response({data: _.isEmpty(hero) ? null : _.cloneDeep(hero)}));
    });
  }
  
  
  find(resource: IResource<IHero & IRecord, this>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const heroes = _.filter(this.heroes, request.criteria);
      resolve(new Response({data: _.cloneDeep(heroes)}));
    });
  }
  
  
  save(resource: IResource<IHero & IRecord, this>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        this.heroes.splice(index, 1, <IHero> request.data);
        resolve(new Response({data: <IHero> _.cloneDeep(request.data)}));
      }
    });
  }
  
  
  destroy(resource: IResource<IHero & IRecord, this>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        const hero = _.first(this.heroes.splice(index, 1));
        resolve(new Response({data: hero}));
      }
    });
  }
  
  private _getMaxId(heroes: Array<IHero>): number {
    const ids: Array<number> = _.map(heroes, (hero) => hero.id);
    return _.max(ids);
  }
}
