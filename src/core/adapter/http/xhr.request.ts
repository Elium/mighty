import * as _ from "lodash";
import {IRequest, Request} from "../request";
import {IMap} from "../../../common/utils/map";

export const DataTypes = {
  text: "text/plain",
  json: "application/json"
};
export const ContentTypes = DataTypes;

export type DataType = "text/plain" | "application/json";
export type ContentType = DataType;

export interface IXhrRequest extends IRequest {
  url?: string
  method?: string
  params?: IMap<string>
  dataType?: DataType
  contentType?: ContentType
  headers?: IMap<string>

  merge?(request: IXhrRequest): IXhrRequest
}

export class XhrRequest extends Request implements IXhrRequest {
  public url: string;
  public method: string;
  public params: IMap<string>;
  public dataType: DataType;
  public contentType: ContentType;

  private _headers: IMap<string>;

  constructor(config: IXhrRequest) {
    super(config);

    this.url = _.get(config, "url", "");
    this.method = _.get(config, "method", "UNKNOWN");
    this.params = _.get(config, "params", <IMap<string>> {});
    this.dataType = _.get(config, "dataType", <DataType> DataTypes.json);
    this.contentType = _.get(config, "contentType", <ContentType> ContentTypes.json);
    this._headers = _.get(config, "headers", <IMap<string>> {});
  }

  public get headers(): IMap<string> {
    return _.merge(this._headers, {"Content-Type": this.contentType});
  }

  public merge(request: IXhrRequest): IXhrRequest {
    return new XhrRequest(_.merge(this, request));
  }
}
