import {IRequest} from "../adapter/request";
import {Pipe} from "./pipe";

export class RequestPipe extends Pipe<IRequest> {
  public create(request: IRequest): IRequest { return request; }
  
  public find(request: IRequest): IRequest { return request; }
  
  public findOne(request: IRequest): IRequest { return request; }
  
  public save(request: IRequest): IRequest { return request; }
  
  public destroy(request: IRequest): IRequest { return request; }
}
