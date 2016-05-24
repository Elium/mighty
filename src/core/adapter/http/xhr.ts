import * as _ from "lodash";
import {IXhrRequest, XhrRequest, ContentTypes} from "./xhr.request";
import {IResponse, Response} from "../response";

export interface IXhr {
  get(request: IXhrRequest): Promise<IResponse>
  post(request: IXhrRequest): Promise<IResponse>
  request(request: IXhrRequest): Promise<IResponse>
  put(request: IXhrRequest): Promise<IResponse>
  patch(request: IXhrRequest): Promise<IResponse>
  delete(request: IXhrRequest): Promise<IResponse>
  query(request: IXhrRequest): Promise<IResponse>
}

export class Xhr implements IXhr {

  constructor() {
  }

  /**
   * GET shortcut
   * @param request
   * @return {Promise}
   */
  public get(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "GET"});
    return this.query(localRequest);
  }


  /**
   * POST shortcut
   * @param request
   * @return {Promise}
   */
  public post(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "POST"});
    return this.query(localRequest);
  }


  /**
   * PUT shortcut
   * @param request
   * @return {Promise}
   */
  public put(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "PUT"});
    return this.query(localRequest);
  }


  /**
   * PATCH shortcut
   * @param request
   * @return {Promise}
   */
  public patch(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "PATCH"});
    return this.query(localRequest);
  }


  /**
   * request shortcut
   * @param request
   * @return {Promise}
   */
  public request(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "request"});
    return this.query(localRequest);
  }


  /**
   * DELETE shortcut
   * @param request
   * @return {Promise}
   */
  public delete(request: IXhrRequest): Promise<IResponse> {
    const localRequest: IXhrRequest = request.merge(<IXhrRequest> {method: "DELETE"});
    return this.query(localRequest);
  }


  /**
   * Query a url with the specified request.
   * @param request
   * @return {Promise}
   */
  public query(request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    return new Promise((resolve) => {
      var xhr = this._getXhr();
      xhr.onreadystatechange = () => this._checkResponse(xhr, resolve);

      if (!_.isEmpty(localRequest.params)) {
        localRequest.url += this._toQueryString(localRequest.params);
      }

      xhr.open(localRequest.method, localRequest.url, true);
      _.forEach(localRequest.headers, (value, key) => xhr.setRequestHeader(key, value));

      let data: any = localRequest.data;
      if (localRequest.contentType === ContentTypes.json) {
        data = JSON.stringify(localRequest.data);
      }

      xhr.send(data || null);
    });
  }


  /**
   * @return {XMLHttpRequest=} A XHR object.
   */
  private _getXhr(): XMLHttpRequest {
    var xhr;
    if (window.hasOwnProperty("XMLHttpRequest") || window.hasOwnProperty("ActiveXObject")) {
      if (window.hasOwnProperty("ActiveXObject")) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
          xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
      } else {
        xhr = new XMLHttpRequest();
      }
    }
    return xhr;
  }


  /**
   * Check the response of the request and fullfill the Promise.
   * @param xhr
   * @param resolve
   * @private
   */
  private _checkResponse(xhr: XMLHttpRequest, resolve: (value?: IResponse) => void) {
    if (xhr.readyState == 4) {
      let result = {data: {}, error: null};
      if (xhr.status == 0 || xhr.status >= 200 && xhr.status < 400) {
        result.data = JSON.parse(xhr.responseText);
      } else {
        result.error = new Error(xhr.responseText);
      }
      resolve(new Response(result));
    }
  }


  /**
   * Parse a json object and returns a, encoded query string.
   * @param params
   * @return {string}
   * @private
   */
  private _toQueryString(params) {
    var parts: Array<String> = [];
    _.forEach(params, (value: string, key: string) => {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return "?" + parts.join("&");
  }
}
