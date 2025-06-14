import { ConnectionTypeResolver } from "./connection-type-resolver";

export const defaultConnectionTypeResolver: ConnectionTypeResolver = () =>
  "direct";
