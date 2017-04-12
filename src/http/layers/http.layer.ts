import * as _ from "lodash"
import * as Request from "request"
import {Options} from "request"
import {IncomingMessage} from "http"
import {IHttpResponse, HttpResponse} from '../http.response'
import {IHttpRequest, HttpRequest} from '../http.request'
import {IDataLayer} from './layer'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'

export interface IHttpLayer extends IDataLayer {
  query(request: IHttpRequest): Observable<IHttpResponse>;
}

export class HttpLayer implements IHttpLayer {
  
  find(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = new HttpRequest(_.merge(request, {method: "GET", isArray: true}))
    return this.query(localRequest)
  }
  
  
  findOne(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = new HttpRequest(_.merge(request, {method: "GET", isArray: false}))
    return this.query(localRequest)
  }
  
  
  create(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = new HttpRequest(_.merge(request, {method: "POST"}))
    return this.query(localRequest)
  }
  
  
  save(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = new HttpRequest(_.merge(request, {method: "PUT"}))
    return this.query(localRequest)
  }
  
  
  destroy(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = new HttpRequest(_.merge(request, {method: "DELETE"}))
    return this.query(localRequest)
  }
  
  query(request: IHttpRequest): Observable<IHttpResponse> {
    const options = this._getOptions(request)
    return this._request(request, options)
  }
  
  private _request(request: IHttpRequest, options: Options): Observable<IHttpResponse> {
    return Observable.create((observer: Observer<IHttpResponse>) => {
      Request(options, (error: any, response: IncomingMessage, body: any) => {
        const httpResponse = new HttpResponse(<IHttpResponse> {
          request: request,
          status: _.get(response, "statusCode", 400)
        })
        if (!error && response.statusCode == 200) {
          if (request.isArray && !Array.isArray(body)) {
            httpResponse.error = new Error("result is not an array, got :" + JSON.stringify(body))
          } else {
            httpResponse.data = body
          }
        } else {
          httpResponse.error = this._parseError(error, body)
        }
        
        if (httpResponse.error) {
          observer.error(httpResponse)
        } else {
          observer.next(httpResponse)
        }
        observer.complete()
      })
    })
  }
  
  private _getOptions(request: IHttpRequest): Options {
    return {
      json: true,
      url: request.url,
      method: (request.method || "").toUpperCase(),
      headers: request.headers,
      gzip: _.get(request.headers, 'accept-encoding', '').indexOf('gzip') > -1,
      body: request.data,
      qs: request.params
    }
  }
  
  private _parseError(error: any, body: any) {
    const validError = error || body
    if (validError) {
      if (_.isString(validError)) {
        return new Error(validError)
      } else if (_.isObject(validError) && validError.hasOwnProperty("message")) {
        return new Error(validError.message)
      }
    }
    return new Error("Unknown error : " + validError)
  }
}
