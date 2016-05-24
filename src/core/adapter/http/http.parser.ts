import {Parser, IParser} from "../parser";

export interface IHttpParser extends IParser {}

export class HttpParser extends Parser implements IHttpParser {}
