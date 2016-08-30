import {RequestPipe} from '../../src/resource/pipe';
import {IRequest, Request} from '../../src/adapter/request';

export class HeroRequestPipe extends RequestPipe {
  create(input: IRequest): IRequest {
    return this._parse(input);
  }
  
  findOne(input: IRequest): IRequest {
    return this._parse(input);
  }
  
  find(input: IRequest): IRequest {
    return this._parse(input);
  }
  
  save(input: IRequest): IRequest {
    return this._parse(input);
  }
  
  destroy(input: IRequest): IRequest {
    return this._parse(input);
  }
  
  _parse(input: IRequest) {
    return new Request({
      data: input.data ? input.data["subKey"] : null,
      criteria: input.criteria ? input.criteria["subKey"] : null
    });
  }
}
