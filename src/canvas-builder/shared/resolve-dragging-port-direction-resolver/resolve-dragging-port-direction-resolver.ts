import { Graph } from "@/graph";
import { DraggingPortDirectionConfig } from "./dragging-port-direction-config";
import {
  NearestConnectablePortDraggingPortDirectionResolver,
  ConnectionAllowedVerifier,
  ConstantDraggingPortDirectionResolver,
  DraggingPortDirectionResolver,
} from "@/configurators";

export const resolveDraggingPortDirectionResolver = (
  config: DraggingPortDirectionConfig,
  graph: Graph,
  connectionAllowedVerifier: ConnectionAllowedVerifier,
): DraggingPortDirectionResolver => {
  if (config === "closest-connectable-port") {
    return new NearestConnectablePortDraggingPortDirectionResolver(
      graph,
      connectionAllowedVerifier,
    );
  }

  // TODO: use "nearest-connectable-port" by default
  if (config === "nearest-connectable-port") {
    return new NearestConnectablePortDraggingPortDirectionResolver(
      graph,
      connectionAllowedVerifier,
    );
  }

  return new ConstantDraggingPortDirectionResolver(config);
};
