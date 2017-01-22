import * as _ from 'lodash';
import {IHttpRequest} from './http.request';
import {IAdapter, Adapter} from '../core/adapter/adapter';
import {hookable, IHookable, IHook} from '../core/utils/hook';
import {IRecord} from '../core/resource/record';
import {IResource} from '../core/resource/resource';
import {IResponse} from '../core/adapter/response';
import {IDataLayer} from './layers/layer';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

export interface IHttpAdapter extends IAdapter {
  baseUrl: string;
  dataLayer: IDataLayer;
}

@hookable
export class HttpAdapter extends Adapter implements IHttpAdapter, IHookable {
  dataLayer: IDataLayer;
  baseUrl: string;

  constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this.baseUrl = baseURl;
    this.dataLayer = dataLayer;
  }

  addHook: (hook: IHook) => void;
  removeHook: (name: string) => void;
  applyHook: <I, O>(name: string, input: I) => Observable<I | O>;

  create<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getBaseRequestData(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeCreate', baseRequest))
      .flatMap(newRequest => this.dataLayer.create(newRequest))
      .flatMap(response => this.applyHook('afterCreate', response));
  }

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getBaseRequestData(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeFindOne', baseRequest))
      .flatMap(newRequest => this.dataLayer.findOne(newRequest))
      .flatMap(response => this.applyHook('afterFindOne', response));
  }

  find<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getBaseRequestData(resource, _.merge(request, {isArray: true}))
      .flatMap(baseRequest => this.applyHook('beforeFind', baseRequest))
      .flatMap(newRequest => this.dataLayer.find(newRequest))
      .flatMap(response => this.applyHook('afterFind', response));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getBaseRequestData(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeSave', baseRequest))
      .flatMap(newRequest => this.dataLayer.save(newRequest))
      .flatMap(response => this.applyHook('afterSave', response));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getBaseRequestData(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeDestroy', baseRequest))
      .flatMap(newRequest => this.dataLayer.destroy(newRequest))
      .flatMap(response => this.applyHook('afterDestroy', response));
  }

  protected _getBaseRequestData<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IHttpRequest> {
    return this.applyHook('beforeRequest', request)
      .flatMap((newRequest: IHttpRequest) => {
        return Observable.of(_.merge({}, newRequest, {url: newRequest.url || `${this.baseUrl}/${resource.identity}`}));
      });
  }
}
