import { ConnectionOptions } from "../options/connection-options";

export interface ApiConnection {
  id?: string;
  from: string;
  to: string;
  options?: ConnectionOptions;
}
