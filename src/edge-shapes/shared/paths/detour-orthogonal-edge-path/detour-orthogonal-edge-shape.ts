import { Point } from "@/point";
import { EdgePath } from "../edge-path";
import { DetourHorizontalEdgePath } from "../detour-horizontal-edge-path";
import { DetourVerticalEdgePath } from "../detour-vertical-edge-path";
import { OrthogonalEdgePath } from "../orthogonal-edge-path";
import { PathPort } from "../../path-port";

export class DetourOrthogonalEdgePath implements EdgePath {
  public readonly path: string;

  private readonly midpoint: Point;

  public constructor(params: {
    readonly from: PathPort;
    readonly to: PathPort;
    readonly arrowLength: number;
    readonly arrowOffset: number;
    readonly roundness: number;
    readonly detourDistance: number;
  }) {
    const isSourceHor = Math.abs(params.from.dir.y) < 1e-10;
    const isTargetHor = Math.abs(params.to.dir.y) < 1e-10;

    if (isSourceHor && isTargetHor) {
      const path = new DetourHorizontalEdgePath(params);

      this.path = path.path;
      this.midpoint = path.calculateMidpoint();
      return;
    }

    if (!isSourceHor && !isTargetHor) {
      const path = new DetourVerticalEdgePath(params);

      this.path = path.path;
      this.midpoint = path.calculateMidpoint();
      return;
    }

    const path = new OrthogonalEdgePath(params);

    this.path = path.path;
    this.midpoint = path.calculateMidpoint();
  }

  public calculateMidpoint(): Point {
    return this.midpoint;
  }
}
