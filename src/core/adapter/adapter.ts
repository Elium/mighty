import {IRequest} from "./request";
import {IResource} from "../resource/index";
import {IResponse} from "./response";
import {Observable} from "rxjs/Rx";

export interface IAdapter {
  create(resource: IResource, request: IRequest): Observable<IResponse>
  find(resource: IResource, request: IRequest): Observable<IResponse>
  findOne(resource: IResource, request: IRequest): Observable<IResponse>
  save(resource: IResource, request: IRequest): Observable<IResponse>
  destroy(resource: IResource, request: IRequest): Observable<IResponse>
}

export abstract class Adapter implements IAdapter {
  abstract create(resource: IResource, request: IRequest): Observable<IResponse>
  abstract find(resource: IResource, request: IRequest): Observable<IResponse>
  abstract findOne(resource: IResource, request: IRequest): Observable<IResponse>
  abstract save(resource: IResource, request: IRequest): Observable<IResponse>
  abstract destroy(resource: IResource, request: IRequest): Observable<IResponse>
}
