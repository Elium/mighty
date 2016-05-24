import * as _ from "lodash";
import * as HeroesData from "./hero.data";
import {Adapter, IAdapter} from "../core/adapter/adapter";
import {IResponse, Response} from "../core/adapter/response";
import {IRequest} from "../core/adapter/request";
import {IResource} from "../core/resource/resource";
import {IParser} from "../core/adapter/parser";
import {IFormatter} from "../core/adapter/formatter";

export interface IHeroAdapter extends IAdapter {
  heroes: Array<any>
}

export class HeroAdapter extends Adapter implements IHeroAdapter {
  public heroes: Array<any>;

  constructor(formatter: IFormatter, parser: IParser) {
    super(formatter, parser);
    this.heroes = _.cloneDeep(HeroesData.db);
  }

  create(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const formattedRequest = this._formatter.create(resource, request);
      const id = this._getMaxId(this.heroes);
      const data = _.merge(formattedRequest.data, {id: id + 1});
      this.heroes.push(data);
      const response = new Response({data: data});
      const parsedResponse = this._parser.create(resource, response);
      resolve(parsedResponse);
    });
  }

  findOne(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const formattedRequest = this._formatter.findOne(resource, request);
      const hero = _.find(this.heroes, formattedRequest.criteria);
      if (_.isUndefined(hero)) {
        reject(new Response({error: new Error("Could not find the specified hero")}));
      } else {
        const response = new Response({data: hero});
        const parsedResponse = this._parser.findOne(resource, response);
        resolve(parsedResponse);
      }
    });
  }

  find(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve) => {
      const formattedRequest = this._formatter.find(resource, request);
      const heroes = _.filter(this.heroes, formattedRequest.criteria);
      const response = new Response({data: heroes});
      const parsedResponse = this._parser.find(resource, response);
      resolve(parsedResponse);
    });
  }

  save(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const formattedRequest = this._formatter.save(resource, request);
      const index = _.findIndex(this.heroes, formattedRequest.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        this.heroes.splice(index, 1, formattedRequest.data);
        const response = new Response({data: formattedRequest.data});
        const parsedResponse = this._parser.save(resource, response);
        resolve(parsedResponse);
      }
    });
  }


  destroy(resource: IResource, request: IRequest): Promise<IResponse> {
    return new Promise((resolve, reject) => {
      const formattedRequest = this._formatter.destroy(resource, request);
      const index = _.findIndex(this.heroes, formattedRequest.criteria);
      if (index < 0) {
        reject(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        const hero = _.first(this.heroes.splice(index, 1));
        const response = new Response({data: hero});
        const parsedResponse = this._parser.destroy(resource, response);
        resolve(parsedResponse);
      }
    });
  }

  private _getMaxId(values): number {
    const ids: Array<number> = _.map <any, number>(values, "id");
    return _.max(ids);
  }
}
