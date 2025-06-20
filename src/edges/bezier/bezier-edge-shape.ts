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
import {
  createBezierLinePath,
  createDetourBezierPath,
  createCycleCirclePath,
} from "../paths";
import { Point, zero } from "@/point";
import { BezierEdgeParams } from "./bezier-edge-params";
import { edgeConstants } from "../edge-constants";

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

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  public constructor(params?: BezierEdgeParams) {
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
    this.arrowWidth = params?.arrowWidth ?? edgeConstants.arrowWidth;
    this.curvature = params?.curvature ?? edgeConstants.curvature;
    this.portCycleRadius = params?.cycleRadius ?? edgeConstants.cycleRadius;
    this.portCycleSmallRadius =
      params?.smallCycleRadius ?? edgeConstants.smallCycleRadius;
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
    this.svg.style.width = `${Math.max(width, 1)}px`;
    this.svg.style.height = `${Math.max(height, 1)}px`;
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
      linePath = createCycleCirclePath({
        fromVector: fromVect,
        radius: this.portCycleRadius,
        smallRadius: this.portCycleSmallRadius,
        arrowLength: this.arrowLength,
        hasSourceArrow: this.hasSourceArrow,
        hasTargetArrow: this.hasTargetArrow,
      });
      targetVect = fromVect;
      targetArrowLength = this.arrowLength;
    } else if (params.from.nodeId === params.to.nodeId) {
      linePath = createDetourBezierPath({
        to,
        fromVector: fromVect,
        toVector: toVect,
        flipX,
        flipY,
        arrowLength: this.arrowLength,
        detourDirection: this.detourDirection,
        detourDistance: this.detourDistance,
        curvature: this.curvature,
        hasSourceArrow: this.hasSourceArrow,
        hasTargetArrow: this.hasTargetArrow,
      });
    } else {
      linePath = createBezierLinePath({
        to,
        fromVector: fromVect,
        toVector: toVect,
        arrowLength: this.arrowLength,
        curvature: this.curvature,
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
