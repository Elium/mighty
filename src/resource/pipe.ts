import {IRequest} from '../adapter/request';
import {IResponse} from '../adapter/response';
export interface IPipe<I,O> {
  create(input: I): O
  findOne(input: I): O
  find(input: I): O
  save(input: I): O
  destroy(input: I): O
}

export class RequestPipe implements IPipe<IRequest, IRequest> {
  create(input: IRequest): IRequest {
    return input;
  }
  
  findOne(input: IRequest): IRequest {
    return input;
  }
  
  find(input: IRequest): IRequest {
    return input;
  }
  
  save(input: IRequest): IRequest {
    return input;
  }
  
  destroy(input: IRequest): IRequest {
    return input;
  }
}

export class ResponsePipe implements IPipe<IResponse, IResponse> {
  create(input: IResponse): IResponse {
    return input;
  }
  
  findOne(input: IResponse): IResponse {
    return input;
  }
  
  find(input: IResponse): IResponse {
    return input;
  }
  
  save(input: IResponse): IResponse {
    return input;
  }
  
  destroy(input: IResponse): IResponse {
    return input;
  }
}
