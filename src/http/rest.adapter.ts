import * as _ from 'lodash'
import {HttpAdapter} from './http.adapter'
import {IRecord} from '../core/resource/record'
import {IResource} from '../core/resource/resource'
import {IHttpRequest} from './http.request'
import {IResponse} from '../core/adapter/response'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/observable/of'

export class RestAdapter extends HttpAdapter {
  
  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getRequestWithId(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeFindOne', baseRequest))
      .flatMap(newRequest => this.dataLayer.findOne(newRequest))
      .flatMap(response => this.applyHook('afterFindOne', response))
  }
  
  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getRequestWithId(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeSave', baseRequest))
      .flatMap(newRequest => this.dataLayer.save(newRequest))
      .flatMap(response => this.applyHook('afterSave', response))
  }
  
  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Observable<IResponse> {
    return this._getRequestWithId(resource, request)
      .flatMap(baseRequest => this.applyHook('beforeDestroy', baseRequest))
      .flatMap(newRequest => this.dataLayer.destroy(newRequest))
      .flatMap(response => this.applyHook('afterDestroy', response))
  }
  
  protected _getRequestWithId<R extends IRecord>(resource: IResource<R>, request: IHttpRequest) {
    return this.applyHook('beforeRequest', request)
      .flatMap((newRequest: IHttpRequest) => {
        const id = _.get(newRequest, 'criteria.id', null) || _.get(newRequest, 'data.id', "")
        return Observable.of(_.merge({}, newRequest, {url: newRequest.url || `${this.baseUrl}/${resource.identity}/${id}`}))
      })
  }
}
