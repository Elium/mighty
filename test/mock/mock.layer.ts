import * as _ from 'lodash';
import {IDataLayer} from '../../src/http/layers/layer';
import {IHttpRequest} from '../../src/http/http.request';
import {IHttpResponse, HttpResponse} from '../../src/http/http.response';
import {IMap} from '../../src/core/utils/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

export class MockLayer<T> implements IDataLayer {
  rows: Array<T>;

  constructor(rows: Array<T>) {
    this.rows = rows;
  }

  create(request: IHttpRequest): Observable<IHttpResponse> {
    const id = this._getMaxId(this.rows);
    const data = _.merge({}, request.data, {id: id + 1});
    this.rows.push(data);
    return Observable.of(new HttpResponse({data: data, status: 200}));
  }


  findOne(request: IHttpRequest): Observable<IHttpResponse> {
    const row = _.find(this.rows, request.criteria);
    return Observable.of(new HttpResponse({data: _.cloneDeep(row), status: 200}));
  }


  find(request: IHttpRequest): Observable<IHttpResponse> {
    const rows = _.filter(this.rows, request.criteria);
    return Observable.of(new HttpResponse({data: _.cloneDeep(rows), status: 200}));
  }


  save(request: IHttpRequest): Observable<IHttpResponse> {
    const index = _.findIndex(this.rows, request.criteria);
    if (index < 0) {
      return Observable.throw(new HttpResponse({error: new Error("There is no match for this row criteria"), status: 400}));
    } else {
      this.rows.splice(index, 1, request.data);
      return Observable.of(new HttpResponse({data: _.cloneDeep(request.data), status: 200}));
    }
  }


  destroy(request: IHttpRequest): Observable<IHttpResponse> {
    const index = _.findIndex(this.rows, request.criteria);
    if (index < 0) {
      return Observable.throw(new HttpResponse({error: new Error("There is no match for this row criteria"), status: 400}));
    } else {
      const row = _.first(this.rows.splice(index, 1));
      return Observable.of(new HttpResponse({data: row, status: 200}));
    }
  }


  private _getMaxId(rows: Array<IMap<any>>): number {
    const ids: Array<number> = _.map(rows, (row) => row["id"]);
    return _.max(ids);
  }
}

