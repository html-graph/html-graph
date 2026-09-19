import { Point } from "@/point";
import { EdgePath } from "../edge-path";
import { DetourHorizontalEdgePath } from "../detour-horizontal-edge-path";
import { DetourVerticalEdgePath } from "../detour-vertical-edge-path";
import { OrthogonalEdgePath } from "../orthogonal-edge-path";
import { EdgePort } from "../../edge-port";

export class DetourOrthogonalEdgePath implements EdgePath {
  public readonly path: string;

  public readonly midpoint: Point;

  public constructor(params: {
    readonly from: EdgePort;
    readonly to: EdgePort;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly detourDistance: number;
    readonly hasSourceArrow: boolean;
    readonly hasTargetArrow: boolean;
  }) {
    const isSourceHor = Math.abs(params.from.dir.y) < 1e-10;
    const isTargetHor = Math.abs(params.to.dir.y) < 1e-10;

    if (isSourceHor && isTargetHor) {
      const path = new DetourHorizontalEdgePath(params);

      this.path = path.path;
      this.midpoint = path.midpoint;
      return;
    }

    if (!isSourceHor && !isTargetHor) {
      const path = new DetourVerticalEdgePath(params);

      this.path = path.path;
      this.midpoint = path.midpoint;
      return;
    }

    const path = new OrthogonalEdgePath(params);

    this.path = path.path;
    this.midpoint = path.midpoint;
  }
}
