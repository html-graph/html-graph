import { Identifier } from "@/identifier";
import { PortIdResolver } from "../port-id-resolver";

export const defaultPortIdResolver: PortIdResolver = (
  portIds: readonly Identifier[],
) => {
  if (portIds.length > 0) {
    return portIds[0];
  }

  return null;
};
