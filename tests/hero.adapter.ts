import * as _ from "lodash";
import * as HeroesData from "./hero.data";
import {Adapter, IAdapter} from "../src/core/adapter/adapter";
import {IResponse, Response} from "../src/core/adapter/response";
import {IRequest} from "../src/core/adapter/request";
import {IResource} from "../src/core/resource/resource";
import {Observable, Observer} from "rxjs/Rx";

export interface IHeroAdapter extends IAdapter {
  heroes: Array<any>
}

export class HeroAdapter extends Adapter implements IHeroAdapter {
  public heroes: Array<any>;

  constructor() {
    super();
    this.heroes = _.cloneDeep(HeroesData.db);
  }

  create(resource: IResource, request: IRequest): Observable<IResponse> {
    return Observable.create((observer: Observer<IResponse>) => {
      const id = this._getMaxId(this.heroes);
      const data = _.merge(request.data, {id: id + 1});
      this.heroes.push(data);
      observer.next(new Response({data: data}));
    });
  }

  findOne(resource: IResource, request: IRequest): Observable<IResponse> {
    return Observable.create((observer: Observer<IResponse>) => {
      const hero = _.find(this.heroes, request.criteria);
      observer.next(new Response({data: hero}));
    });
  }

  find(resource: IResource, request: IRequest): Observable<IResponse> {
    return Observable.create((observer: Observer<IResponse>) => {
      const heroes = _.filter(this.heroes, request.criteria);
      observer.next(new Response({data: heroes}));
    });
  }

  save(resource: IResource, request: IRequest): Observable<IResponse> {
    return Observable.create((observer: Observer<IResponse>) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        observer.error(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        this.heroes.splice(index, 1, request.data);
        observer.next(new Response({data: request.data}));
      }
    });
  }


  destroy(resource: IResource, request: IRequest): Observable<IResponse> {
    return Observable.create((observer: Observer<IResponse>) => {
      const index = _.findIndex(this.heroes, request.criteria);
      if (index < 0) {
        observer.error(new Response({error: new Error("There is no match for this hero criteria")}));
      } else {
        const hero = _.first(this.heroes.splice(index, 1));
        observer.next(new Response({data: hero}));
      }
    });
  }

  private _getMaxId(values): number {
    const ids: Array<number> = _.map <any, number>(values, "id");
    return _.max(ids);
  }
}
