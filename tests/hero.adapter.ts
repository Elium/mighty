import * as _ from "lodash";
import * as HeroesData from "./hero.data";
import {Adapter, IAdapter} from "../src/core/adapter/adapter";
import {IResponse, Response} from "../src/core/adapter/response";
import {IRequest} from "../src/core/adapter/request";
import {IResource} from "../src/core/resource/resource";

export interface IHeroAdapter extends IAdapter {
  heroes: Array<any>
}

export class HeroAdapter extends Adapter implements IHeroAdapter {
  public heroes: Array<any>;

  constructor() {
    super();
    this.heroes = _.cloneDeep(HeroesData.db);
  }

  create(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const id = this._getMaxId(this.heroes);
      const data = _.merge(request.data, {id: id + 1});
      this.heroes.push(data);
      resolve(new Response({data: data}));
    });
  }

  findOne(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const hero = _.find(this.heroes, request.criteria);
      resolve(new Response({data: hero}));
    });
  }

  find(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const heroes = _.filter(this.heroes, request.criteria);
      resolve(new Response({data: heroes}));
    });
  }

  save(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        this.heroes.splice(index, 1, request.data);
        resolve(new Response({data: request.data}));
      }
    });
  }


  destroy(resource: IResource, request: IRequest): Promise<IResponse> {
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

  private _getMaxId(values): number {
    const ids: Array<number> = _.map <any, number>(values, "id");
    return _.max(ids);
  }
}
