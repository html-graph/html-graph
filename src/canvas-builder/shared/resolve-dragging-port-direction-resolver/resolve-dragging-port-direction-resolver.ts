import { Graph } from "@/graph";
import { DraggingPortDirectionConfig } from "./dragging-port-direction-config";
import {
  NearestConnectablePortDraggingPortDirectionResolver,
  ConnectionAllowedVerifier,
  ConstantDraggingPortDirectionResolver,
  DraggingPortDirectionResolver,
} from "@/configurators";

export const resolveDraggingPortDirectionResolver = (
  config: DraggingPortDirectionConfig | undefined,
  graph: Graph,
  connectionAllowedVerifier: ConnectionAllowedVerifier,
): DraggingPortDirectionResolver => {
  if (config === "nearest-connectable-port") {
    return new NearestConnectablePortDraggingPortDirectionResolver(
      graph,
      connectionAllowedVerifier,
    );
  }

  if (typeof config === "number") {
    return new ConstantDraggingPortDirectionResolver(config);
  }

  return new ConstantDraggingPortDirectionResolver(undefined);
};
