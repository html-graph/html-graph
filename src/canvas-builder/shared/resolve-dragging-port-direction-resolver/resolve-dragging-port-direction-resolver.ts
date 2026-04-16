import { Graph } from "@/graph";
import { DraggingPortDirectionConfig } from "./dragging-port-direction-config";
import {
  ClosestConnectablePortDraggingPortDirectionResolver,
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
    return new ClosestConnectablePortDraggingPortDirectionResolver(
      graph,
      connectionAllowedVerifier,
    );
  }

  return new ConstantDraggingPortDirectionResolver(config);
};
