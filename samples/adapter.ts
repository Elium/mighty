import {Adapter} from '../src/core/adapter/adapter';
import {IResponse, Response} from '../src/core/adapter/response';
import {IResource} from '../src/core/resource/resource';
import {Observable} from 'rxjs/Rx';
import {IRequest} from '../src/core/adapter/request';

export class SampleAdapter extends Adapter {
  create(resource: IResource<any>, request: IRequest): Observable<IResponse> {
    return new Observable((subscriber) => subscriber.next(new Response({})));
  }

  find(resource: IResource<any>, request: IRequest): Observable<IResponse> {
    return new Observable((subscriber) => subscriber.next(new Response({})));
  }

  findOne(resource: IResource<any>, request: IRequest): Observable<IResponse> {
    return new Observable((subscriber) => subscriber.next(new Response({})));
  }

  save(resource: IResource<any>, request: IRequest): Observable<IResponse> {
    return new Observable((subscriber) => subscriber.next(new Response({})));
  }

  destroy(resource: IResource<any>, request: IRequest): Observable<IResponse> {
    return new Observable((subscriber) => subscriber.next(new Response({})));
  }
}
