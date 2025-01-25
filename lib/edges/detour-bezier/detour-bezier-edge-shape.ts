import { EdgeShape } from "../edge-shape";
import { from } from "../from";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createRotatedPoint,
  createEdgeLine,
} from "../utils";
import { Point } from "@/point";

export class DetourBezierEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(
    color: string,
    width: number,
    private readonly curvature: number,
    private readonly arrowLength: number,
    private readonly arrowWidth: number,
    hasSourceArrow: boolean,
    hasTargetArrow: boolean,
    detourDistance: number,
    detourDirection: number,
  ) {
    this.detourX = Math.cos(detourDirection) * detourDistance;
    this.detourY = Math.sin(detourDirection) * detourDistance;

    this.svg.appendChild(this.group);
    this.line = createEdgeLine(color, width);
    this.group.appendChild(this.line);

    if (hasSourceArrow) {
      this.sourceArrow = createEdgeArrow(color);
      this.group.appendChild(this.sourceArrow);
    }

    if (hasTargetArrow) {
      this.targetArrow = createEdgeArrow(color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public update(
    to: Point,
    flipX: number,
    flipY: number,
    fromDir: number,
    toDir: number,
  ): void {
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(fromDir, flipX, flipY);
    const toVect = createFlipDirectionVector(toDir, flipX, flipY);

    const pba: Point = this.sourceArrow
      ? createRotatedPoint({ x: this.arrowLength, y: 0 }, fromVect, from)
      : from;

    const pea: Point = this.targetArrow
      ? createRotatedPoint({ x: to.x - this.arrowLength, y: to.y }, toVect, to)
      : to;

    const gap1 = this.arrowLength;
    const flipDetourX = this.detourX * flipX;
    const flipDetourY = this.detourY * flipY;

    const pbl1: Point = createRotatedPoint({ x: gap1, y: 0 }, fromVect, from);
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

    const linePath = [
      `M ${pba.x} ${pba.y}`,
      `L ${pbl1.x} ${pbl1.y}`,
      `C ${pbc1.x} ${pbc1.y} ${pbc2.x} ${pbc2.y} ${pm.x} ${pm.y}`,
      `C ${pec2.x} ${pec2.y} ${pec1.x} ${pec1.y} ${pel1.x} ${pel1.y}`,
      `L ${pea.x} ${pea.y}`,
    ].join(" ");

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        fromVect,
        from,
        this.arrowLength,
        this.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        toVect,
        to,
        -this.arrowLength,
        this.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }
}
