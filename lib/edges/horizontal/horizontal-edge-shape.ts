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
} from "../utils";
import { Point, zero } from "@/point";
import { HorizontalEdgeParams } from "./horizontal-edge-params";
import { createHorizontalLinePath } from "../utils/create-horizontal-line-path";
import { createCycleSquareLinePath } from "../utils/create-cycle-square-line-path";
import { createDetourStraightLinePath } from "../utils/create-detour-straight-line-path";

export class HorizontalEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly side: number;

  private readonly detourX: number;

  private readonly detourY: number;

  public constructor(params: HorizontalEdgeParams) {
    this.arrowLength = params.arrowLength;
    this.arrowWidth = params.arrowWidth;
    this.arrowOffset = params.arrowOffset;
    this.roundness = Math.min(
      params.roundness,
      params.arrowOffset,
      params.cycleSquareSide / 2,
    );
    this.side = params.cycleSquareSide;
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
      linePath = createCycleSquareLinePath({
        fromVect,
        arrowLength: this.arrowLength,
        side: this.side,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        hasSourceArrow: this.sourceArrow !== null,
        hasTargetArrow: this.targetArrow !== null,
      });
      targetVect = fromVect;
      targetArrowLength = this.arrowLength;
    } else if (params.source.nodeId === params.target.nodeId) {
      linePath = createDetourStraightLinePath({
        to,
        fromVect,
        toVect,
        flipX,
        flipY,
        arrowLength: this.arrowLength,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        detourX: this.detourX,
        detourY: this.detourY,
        hasSourceArrow: this.sourceArrow !== null,
        hasTargetArrow: this.targetArrow !== null,
      });
    } else {
      linePath = createHorizontalLinePath({
        to,
        fromVect,
        toVect,
        flipX,
        arrowLength: this.arrowLength,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        hasSourceArrow: this.sourceArrow !== null,
        hasTargetArrow: this.targetArrow !== null,
      });
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
}
