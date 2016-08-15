import * as _ from 'lodash';
import {IHero, IHeroRecord} from './hero.data';
import {IRank} from './rank.data';
import {Adapter, IAdapter} from '../../src/core/adapter/adapter';
import {IResponse, Response} from '../../src/core/adapter/response';
import {IRequest} from '../../src/core/adapter/request';
import {IResource} from '../../src/core/resource/resource';
import {IMap} from '../../src/common/utils/map';

export interface IMockAdapter extends IAdapter {
  heroes: Array<IHero>
  ranks: Array<IRank>
}

export class MockAdapter extends Adapter implements IMockAdapter {
  public heroes: Array<IHero>;
  public ranks: Array<IRank>;

  constructor(heroes: Array<IHero>, ranks: Array<IRank>) {
    super();
    this.heroes = heroes;
    this.ranks = ranks;
  }

  create(resource: IResource<any>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const id = this._getMaxId(this.heroes);
      const data = _.merge({}, <IHero> request.data, {id: id + 1});
      this.heroes.push(data);
      resolve(new Response({data: data}));
    })
      .then((response: IResponse) => this._populate(resource, request, response));
  }


  findOne(resource: IResource<any>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const hero = _.find(this.heroes, request.criteria);
      resolve(new Response({data: _.isEmpty(hero) ? null : _.cloneDeep(hero)}));
    })
      .then((response: IResponse) => this._populate(resource, request, response));
  }


  find(resource: IResource<any>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const heroes = _.filter(this.heroes, request.criteria);
      resolve(new Response({data: _.cloneDeep(heroes)}));
    })
      .then((response: IResponse) => this._populate(resource, request, response));
  }


  save(resource: IResource<any>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        this.heroes.splice(index, 1, <IHero> request.data);
        resolve(new Response({data: <IHero> _.cloneDeep(request.data)}));
      }
    })
      .then((response: IResponse) => this._populate(resource, request, response));
  }


  destroy(resource: IResource<any>, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        const hero = _.first(this.heroes.splice(index, 1));
        resolve(new Response({data: hero}));
      }
    })
      .then((response: IResponse) => this._populate(resource, request, response));
  }


  protected _populate(resource: IResource<IHeroRecord>, request: IRequest, response: IResponse): Promise<IResponse> {
    return new Promise((resolve) => {
      if (!_.isEmpty(request.populate) && request.populate.indexOf("rank") > -1) {
        if (Array.isArray(response.data)) {
          (<Array<IMap<any>>> response.data).forEach((hero) => {
            hero["rank"] = _.find(this.ranks, {id: hero["rankId"]});
          });
        } else {
          response.data["rank"] = _.find(this.ranks, {id: response.data["rankId"]});
        }
      }
      resolve(response);
    });
  }


  private _getMaxId(heroes: Array<IHero>): number {
    const ids: Array<number> = _.map(heroes, (hero) => hero.id);
    return _.max(ids);
  }
}
