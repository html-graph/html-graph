import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createBezierLinePath,
  createDetourBezierPath,
  createCycleCirclePath,
} from "../paths";
import { Point } from "@/point";
import { BezierEdgeParams } from "./bezier-edge-params";
import { edgeConstants } from "../edge-constants";
import { GenericEdgeShape } from "../generic";

export class BezierEdgeShape implements EdgeShape {
  public readonly svg: SVGSVGElement;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly curvature: number;

  private readonly portCycleRadius: number;

  private readonly portCycleSmallRadius: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly genericShape: GenericEdgeShape;

  private readonly createCyclePath = (fromDirection: Point): string =>
    createCycleCirclePath({
      fromVector: fromDirection,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  private readonly createDetourPath = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ): string =>
    createDetourBezierPath({
      to,
      fromVector: sourceDirection,
      toVector: targetDirection,
      flipX,
      flipY,
      arrowLength: this.arrowLength,
      detourDirection: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  private readonly createLinePath = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
  ): string =>
    createBezierLinePath({
      to,
      fromVector: sourceDirection,
      toVector: targetDirection,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

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

    this.genericShape = new GenericEdgeShape({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowLength: this.arrowLength,
      arrowWidth: this.arrowWidth,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
    });

    this.svg = this.genericShape.svg;
  }

  public render(params: EdgeRenderParams): void {
    this.genericShape.render(params);
  }
}
