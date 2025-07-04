import { EdgeRenderParams } from "../edge-render-params";
import { Point, zero } from "@/point";
import { LineEdgeParams } from "./line-edge-params";
import { createArrowPath } from "./create-arrow-path";
import { createEdgeArrow } from "./create-edge-arrow";
import { createEdgeGroup } from "./create-edge-group";
import { createEdgeLine } from "./create-edge-line";
import { createEdgeRectangle } from "./create-edge-rectangle";
import { createEdgeSvg } from "./create-edge-svg";
import { createFlipDirectionVector } from "./create-flip-direction-vector";
import { CreatePathFn } from "./create-path-fn";
import { StructuredEdgeShape } from "../structured-edge-shape";

// Responsibility: Providing low level core for single line structured edges
export class LineEdgeShape implements StructuredEdgeShape {
  public readonly svg = createEdgeSvg();

  public readonly group = createEdgeGroup();

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  public constructor(private readonly params: LineEdgeParams) {
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
      params.from,
      params.to,
    );

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.svg.style.width = `${Math.max(width, 1)}px`;
    this.svg.style.height = `${Math.max(height, 1)}px`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const sourceDirection = createFlipDirectionVector(
      params.from.direction,
      flipX,
      flipY,
    );

    const targetDirection = createFlipDirectionVector(
      params.to.direction,
      flipX,
      flipY,
    );

    const to: Point = {
      x: width,
      y: height,
    };

    let targetVect = targetDirection;
    let targetArrowLength = -this.params.arrowLength;
    let createPathFn: CreatePathFn;

    if (params.from.portId === params.to.portId) {
      createPathFn = this.params.createCyclePath;
      targetVect = sourceDirection;
      targetArrowLength = this.params.arrowLength;
    } else if (params.from.nodeId === params.to.nodeId) {
      createPathFn = this.params.createDetourPath;
    } else {
      createPathFn = this.params.createLinePath;
    }

    const linePath = createPathFn(
      sourceDirection,
      targetDirection,
      to,
      flipX,
      flipY,
    );

    this.line.setAttribute("d", linePath);

    if (this.sourceArrow) {
      const arrowPath = createArrowPath(
        sourceDirection,
        zero,
        this.params.arrowLength,
        this.params.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", arrowPath);
    }

    if (this.targetArrow) {
      const arrowPath = createArrowPath(
        targetVect,
        to,
        targetArrowLength,
        this.params.arrowWidth,
      );

      this.targetArrow.setAttribute("d", arrowPath);
    }
  }
}
