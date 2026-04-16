import { Point } from "@/point";
import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";
import { Graph } from "@/graph";
import { ConnectionAllowedVerifier } from "../../connection-allowed-verifier";
import { DraggingPortDirectionResolverParams } from "../dragging-port-direction-resolver-params";

export class ClosestConnectablePortDraggingPortDirectionResolver
  implements DraggingPortDirectionResolver
{
  public constructor(
    private readonly graph: Graph,
    private readonly connectionAllowedVerifier: ConnectionAllowedVerifier,
  ) {}

  public resolve(
    params: DraggingPortDirectionResolverParams,
  ): number | undefined {
    let closestDirection: number | undefined = undefined;
    let closestDistance = Infinity;
    const { cursor } = params;

    this.graph.getAllPortIds().forEach((portId) => {
      const { element, direction, nodeId } = this.graph.getPort(portId);
      const { x, y } = this.graph.getNode(nodeId);

      if (x === null || y === null) {
        return;
      }

      const from = params.isDirect ? params.staticPortId : portId;
      const to = params.isDirect ? portId : params.staticPortId;

      if (!this.connectionAllowedVerifier({ from, to })) {
        return;
      }

      const { top, left, width, height } = element.getBoundingClientRect();
      const center: Point = { x: left + width / 2, y: top + height / 2 };
      const dx = cursor.x - center.x;
      const dy = cursor.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestDirection = direction;
      }
    });

    return closestDirection;
  }
}
