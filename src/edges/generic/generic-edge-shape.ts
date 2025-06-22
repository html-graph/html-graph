import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createArrowPath,
  createFlipDirectionVector,
  createEdgeArrow,
  createEdgeGroup,
  createEdgeSvg,
  createEdgeLine,
  createEdgeRectangle,
} from "../shared";
import { Point, zero } from "@/point";
import { GenericEdgeParams } from "./generic-edge-params";

export class GenericEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  public constructor(private readonly params: GenericEdgeParams) {
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

    let linePath: string;
    let targetVect = targetDirection;
    let targetArrowLength = -this.params.arrowLength;

    if (params.from.portId === params.to.portId) {
      linePath = this.params.createCyclePath(
        sourceDirection,
        targetDirection,
        to,
        flipX,
        flipY,
      );
      targetVect = sourceDirection;
      targetArrowLength = this.params.arrowLength;
    } else if (params.from.nodeId === params.to.nodeId) {
      linePath = this.params.createDetourPath(
        sourceDirection,
        targetDirection,
        to,
        flipX,
        flipY,
      );
    } else {
      linePath = this.params.createLinePath(
        sourceDirection,
        targetDirection,
        to,
        flipX,
        flipY,
      );
    }

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
