import { ConnectionOptions } from "./connection-options";

export interface AddConnectionRequest {
  id?: string;
  from: string;
  to: string;
  options?: ConnectionOptions;
}
