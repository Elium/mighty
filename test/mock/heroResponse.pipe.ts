import {ResponsePipe} from '../../src/resource/pipe';
import {IResponse, Response} from '../../src/adapter/response';

export class HeroResponsePipe extends ResponsePipe {
  create(input: IResponse): IResponse {
    return this._parse(input);
  }
  
  findOne(input: IResponse): IResponse {
    return this._parse(input);
  }
  
  find(input: IResponse): IResponse {
    return this._parse(input);
  }
  
  save(input: IResponse): IResponse {
    return this._parse(input);
  }
  
  destroy(input: IResponse): IResponse {
    return this._parse(input);
  }
  
  _parse(input: IResponse) {
    return new Response({
      error: input.error,
      data: input.data ? input.data["subKey"] : null
    });
  }
}
