import { ConnectionController } from "./connection-controller";

export interface ApiConnection {
  id?: string;
  from: string;
  to: string;
  svgController?: ConnectionController;
}
