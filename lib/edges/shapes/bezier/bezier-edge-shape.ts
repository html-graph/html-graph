import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
  createEdgeRectangle,
} from "../utils";
import { Point, zero } from "@/point";
import { BezierEdgeParams } from "./bezier-edge-params";

export class BezierEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly curvature: number;

  private readonly portCycleRadius: number;

  private readonly portCycleSmallRadius: number;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(params: BezierEdgeParams) {
    this.arrowLength = params.arrowLength;
    this.arrowWidth = params.arrowWidth;
    this.curvature = params.curvature;
    this.portCycleRadius = params.cycleRadius;
    this.portCycleSmallRadius = params.smallCycleRadius;
    this.detourX = Math.cos(params.detourDirection) * params.detourDistance;
    this.detourY = Math.sin(params.detourDirection) * params.detourDistance;

    this.svg.appendChild(this.group);
    this.line = createEdgeLine(params.color, params.width);
    this.group.appendChild(this.line);

    if (params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow(params.color);
      this.group.appendChild(this.sourceArrow);
    }

    if (params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow(params.color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.source,
      params.target,
    );

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(
      params.source.direction,
      flipX,
      flipY,
    );
    const toVect = createFlipDirectionVector(
      params.target.direction,
      flipX,
      flipY,
    );

    const to: Point = {
      x: width,
      y: height,
    };

    let linePath: string;
    let targetVect = toVect;
    let targetArrowLength = -this.arrowLength;

    if (params.source.portId === params.target.portId) {
      linePath = this.createPortCyclePath(fromVect);
      targetVect = fromVect;
      targetArrowLength = this.arrowLength;
    } else if (params.source.nodeId === params.target.nodeId) {
      linePath = this.createNodeCyclePath(to, fromVect, toVect, flipX, flipY);
    } else {
      linePath = this.createLinePath(to, fromVect, toVect);
    }

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        zero,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        targetVect,
        to,
        targetArrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }

  private createLinePath(to: Point, fromVect: Point, toVect: Point): string {
    const pb = createRotatedPoint(
      { x: this.arrowLength, y: zero.y },
      fromVect,
      zero,
    );

    const pe = createRotatedPoint(
      { x: to.x - this.arrowLength, y: to.y },
      toVect,
      to,
    );

    const bpb: Point = {
      x: pb.x + fromVect.x * this.curvature,
      y: pb.y + fromVect.y * this.curvature,
    };

    const bpe: Point = {
      x: pe.x - toVect.x * this.curvature,
      y: pe.y - toVect.y * this.curvature,
    };

    const lcurve = `M ${pb.x} ${pb.y} C ${bpb.x} ${bpb.y}, ${bpe.x} ${bpe.y}, ${pe.x} ${pe.y}`;
    const preLine = this.sourceArrow
      ? ""
      : `M ${zero.x} ${zero.y} L ${pb.x} ${pb.y} `;
    const postLine = this.targetArrow
      ? ""
      : ` M ${pe.x} ${pe.y} L ${to.x} ${to.y}`;

    return `${preLine}${lcurve}${postLine}`;
  }

  private createPortCyclePath(fromVect: Point): string {
    const r = this.portCycleSmallRadius;
    const R = this.portCycleRadius;
    const len = Math.sqrt(r * r + R * R);
    const g = r + R;
    const px = this.arrowLength + len * (1 - R / g);
    const py = (r * R) / g;

    const points: Point[] = [
      { x: this.arrowLength, y: zero.y },
      { x: px, y: py },
      { x: px, y: -py },
    ];

    const rp = points.map((p) => createRotatedPoint(p, fromVect, zero));

    const c = [
      `M ${rp[0].x} ${rp[0].y}`,
      `A ${r} ${r} 0 0 1 ${rp[1].x} ${rp[1].y}`,
      `A ${R} ${R} 0 1 0 ${rp[2].x} ${rp[2].y}`,
      `A ${r} ${r} 0 0 1 ${rp[0].x} ${rp[0].y}`,
    ].join(" ");

    const preLine = `M ${0} ${0} L ${rp[0].x} ${rp[0].y} `;

    return `${this.sourceArrow !== null || this.targetArrow !== null ? "" : preLine}${c}`;
  }

  private createNodeCyclePath(
    to: Point,
    fromVect: Point,
    toVect: Point,
    flipX: number,
    flipY: number,
  ): string {
    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: zero.y }, fromVect, zero)
      : zero;

    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: to.x - this.arrowLength, y: to.y }, toVect, to)
      : to;

    const gap1 = this.arrowLength;
    const flipDetourX = this.detourX * flipX;
    const flipDetourY = this.detourY * flipY;

    const pbl1: Point = createRotatedPoint(
      { x: gap1, y: zero.y },
      fromVect,
      zero,
    );
    const pbl2: Point = {
      x: pbl1.x + flipDetourX,
      y: pbl1.y + flipDetourY,
    };
    const pel1: Point = createRotatedPoint(
      { x: to.x - gap1, y: to.y },
      toVect,
      to,
    );
    const pel2: Point = {
      x: pel1.x + flipDetourX,
      y: pel1.y + flipDetourY,
    };
    const pm: Point = { x: (pbl2.x + pel2.x) / 2, y: (pbl2.y + pel2.y) / 2 };
    const pbc1: Point = {
      x: pbl1.x + this.curvature * fromVect.x,
      y: pbl1.y + this.curvature * fromVect.y,
    };

    const pec1: Point = {
      x: pel1.x - this.curvature * toVect.x,
      y: pel1.y - this.curvature * toVect.y,
    };

    const pbc2: Point = {
      x: pbl1.x + flipDetourX,
      y: pbl1.y + flipDetourY,
    };
    const pec2: Point = {
      x: pel1.x + flipDetourX,
      y: pel1.y + flipDetourY,
    };

    return [
      `M ${pba.x} ${pba.y}`,
      `L ${pbl1.x} ${pbl1.y}`,
      `C ${pbc1.x} ${pbc1.y} ${pbc2.x} ${pbc2.y} ${pm.x} ${pm.y}`,
      `C ${pec2.x} ${pec2.y} ${pec1.x} ${pec1.y} ${pel1.x} ${pel1.y}`,
      `L ${pea.x} ${pea.y}`,
    ].join(" ");
  }
}
