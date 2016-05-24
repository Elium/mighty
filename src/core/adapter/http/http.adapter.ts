import {IXhr, Xhr} from "./xhr";
import {IXhrRequest} from "./xhr.request";
import {HttpFormatter, IHttpFormatter} from "./http.formatter";
import {HttpParser, IHttpParser} from "./http.parser";
import {IResource} from "../../resource/resource";
import {IResponse} from "../response";
import {IAdapter, Adapter} from "../adapter";

export interface IHttpAdapter extends IAdapter {
  formatter: IHttpFormatter
  parser: IHttpParser
}

export class HttpAdapter extends Adapter implements IHttpAdapter {
  private _http: IXhr = new Xhr();
  
  public constructor(formatter?: IHttpFormatter, parser?: IHttpParser) {
    super(formatter, parser);
    
    if (!formatter && !parser) {
      this._formatter = new HttpFormatter();
      this._parser = new HttpParser();
    }
  }
  
  
  public get formatter(): IHttpFormatter {
    return <IHttpFormatter> this._formatter;
  }
  
  public get parser(): IHttpParser {
    return <IHttpParser> this._parser;
  }
  
  
  /**
   * Create a new object.
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public create(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = request.merge(<IXhrRequest> {url: resource.schema.id});
    const formattedRequest = this._formatter.create(resource, localRequest);
    
    return this._http
      .post(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.create(resource, response);
      });
  }
  
  
  /**
   * Get the first item matching the criteria.
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public findOne(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = request.merge(<IXhrRequest> {url: resource.schema.id});
    const formattedRequest = this._formatter.findOne(resource, localRequest);
    
    return this._http
      .get(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.findOne(resource, response);
      });
  }
  
  
  /**
   * Get all entries matching the specific .
   * @param resource
   * @param request
   * @return {Promise<Array<IResource>>}
   */
  public find(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = request.merge(<IXhrRequest> {url: resource.schema.id});
    const formattedRequest = this._formatter.find(resource, localRequest);
    
    return this._http
      .get(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.find(resource, response);
      });
  }
  
  
  /**
   * Update the specified
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public save(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = request.merge(<IXhrRequest> {url: resource.schema.id});
    const formattedRequest = this._formatter.save(resource, localRequest);
    
    return this._http
      .put(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.save(resource, response);
      });
  }
  
  
  /**
   * Remove the specified entry
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public destroy(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = request.merge(<IXhrRequest> {url: resource.schema.id});
    const formattedRequest = this._formatter.destroy(resource, localRequest);
    
    return this._http
      .delete(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.destroy(resource, response);
      });
  }
}
