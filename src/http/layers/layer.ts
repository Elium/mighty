import {IHttpRequest} from '../http.request'
import {IHttpResponse} from '../http.response'
import {Observable} from 'rxjs/Observable'

export interface IDataLayer {
  create(request: IHttpRequest): Observable<IHttpResponse>;
  save(request: IHttpRequest): Observable<IHttpResponse>;
  find(request: IHttpRequest): Observable<IHttpResponse>;
  findOne(request: IHttpRequest): Observable<IHttpResponse>;
  destroy(request: IHttpRequest): Observable<IHttpResponse>;
}
