import { Graph } from "@/graph";
import { DraggingPortDirectionConfig } from "./dragging-port-direction-config";
import {
  ClosestConnectablePortDraggingPortDirectionResolver,
  ConstantDraggingPortDirectionResolver,
  DraggingPortDirectionResolver,
} from "@/configurators";

export const resolveDraggingPortDirectionResolver = (
  config: DraggingPortDirectionConfig,
  graph: Graph,
): DraggingPortDirectionResolver => {
  if (config === "closest-connectable-port") {
    return new ClosestConnectablePortDraggingPortDirectionResolver(graph);
  }

  return new ConstantDraggingPortDirectionResolver(config);
};
