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
import {
  createCycleSquarePath,
  createDetourStraightPath,
  createStraightLinePath,
} from "../paths";
import { Point, zero } from "@/point";
import { StraightEdgeParams } from "./straight-edge-params";
import { edgeConstants } from "../edge-constants";

export class StraightEdgeShape implements EdgeShape {
  public readonly svg = createEdgeSvg();

  private readonly group = createEdgeGroup();

  private readonly line: SVGPathElement;

  private readonly sourceArrow: SVGPathElement | null = null;

  private readonly targetArrow: SVGPathElement | null = null;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  public constructor(params?: StraightEdgeParams) {
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params?.arrowWidth ?? edgeConstants.arrowWidth;
    this.arrowOffset = params?.arrowOffset ?? edgeConstants.arrowOffset;
    this.cycleSquareSide =
      params?.cycleSquareSide ?? edgeConstants.cycleSquareSide;

    const roundness = params?.roundness ?? edgeConstants.roundness;

    this.roundness = Math.min(
      roundness,
      this.arrowOffset,
      this.cycleSquareSide / 2,
    );

    this.detourDirection =
      params?.detourDirection ?? edgeConstants.detourDirection;
    this.detourDistance =
      params?.detourDistance ?? edgeConstants.detourDistance;

    this.hasSourceArrow =
      params?.hasSourceArrow ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow =
      params?.hasTargetArrow ?? edgeConstants.hasTargetArrow;

    const color = params?.color ?? edgeConstants.color;
    const width = params?.width ?? edgeConstants.width;

    this.svg.appendChild(this.group);
    this.line = createEdgeLine(color, width);
    this.group.appendChild(this.line);

    if (this.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow(color);
      this.group.appendChild(this.sourceArrow);
    }

    if (this.hasTargetArrow) {
      this.targetArrow = createEdgeArrow(color);
      this.group.appendChild(this.targetArrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.from,
      params.to,
    );

    this.svg.style.transform = `translate(${x}px, ${y}px)`;
    this.svg.style.width = `${width}px`;
    this.svg.style.height = `${height}px`;
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const fromVect = createFlipDirectionVector(
      params.from.direction,
      flipX,
      flipY,
    );
    const toVect = createFlipDirectionVector(params.to.direction, flipX, flipY);

    const to: Point = {
      x: width,
      y: height,
    };

    let linePath: string;
    let targetVect = toVect;
    let targetArrowLength = -this.arrowLength;

    if (params.from.portId === params.to.portId) {
      linePath = createCycleSquarePath({
        fromVector: fromVect,
        arrowLength: this.arrowLength,
        side: this.cycleSquareSide,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        hasSourceArrow: this.hasSourceArrow,
        hasTargetArrow: this.hasTargetArrow,
      });
      targetVect = fromVect;
      targetArrowLength = this.arrowLength;
    } else if (params.from.nodeId === params.to.nodeId) {
      linePath = createDetourStraightPath({
        to,
        fromVector: fromVect,
        toVector: toVect,
        flipX,
        flipY,
        arrowLength: this.arrowLength,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        detourDirection: this.detourDirection,
        detourDistance: this.detourDistance,
        hasSourceArrow: this.hasSourceArrow,
        hasTargetArrow: this.hasTargetArrow,
      });
    } else {
      linePath = createStraightLinePath({
        to,
        fromVector: fromVect,
        toVector: toVect,
        arrowLength: this.arrowLength,
        arrowOffset: this.arrowOffset,
        roundness: this.roundness,
        hasSourceArrow: this.hasSourceArrow,
        hasTargetArrow: this.hasTargetArrow,
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
