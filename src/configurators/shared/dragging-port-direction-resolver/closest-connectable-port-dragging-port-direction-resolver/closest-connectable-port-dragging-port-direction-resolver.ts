import { Point } from "@/point";
import { DraggingPortDirectionResolver } from "../dragging-port-direction-resolver";
import { Graph } from "@/graph";

export class ClosestConnectablePortDraggingPortDirectionResolver
  implements DraggingPortDirectionResolver
{
  public constructor(private readonly graph: Graph) {}

  public resolve(cursor: Point): number | undefined {
    let closestDirection: number | undefined = undefined;
    let closestDistance = Infinity;

    this.graph.getAllPortIds().forEach((portId) => {
      const { element, direction, nodeId } = this.graph.getPort(portId);
      const { x, y } = this.graph.getNode(nodeId);

      if (x === null || y === null) {
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
