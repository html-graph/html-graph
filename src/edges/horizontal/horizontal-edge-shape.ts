import { EdgeShape } from "../edge-shape";
import { EdgeRenderParams } from "../edge-render-params";
import {
  createCycleSquarePath,
  createDetourStraightPath,
  createHorizontalLinePath,
} from "../paths";
import { Point } from "@/point";
import { HorizontalEdgeParams } from "./horizontal-edge-params";
import { edgeConstants } from "../edge-constants";
import { GenericEdgeShape } from "../generic";

export class HorizontalEdgeShape implements EdgeShape {
  public readonly svg: SVGSVGElement;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly genericShape: GenericEdgeShape;

  private readonly createCyclePath = (fromDirection: Point): string =>
    createCycleSquarePath({
      fromVector: fromDirection,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
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
    createDetourStraightPath({
      to,
      fromVector: sourceDirection,
      toVector: targetDirection,
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

  private readonly createLinePath = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
  ): string =>
    createHorizontalLinePath({
      to,
      fromVector: sourceDirection,
      toVector: targetDirection,
      flipX,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  public constructor(params?: HorizontalEdgeParams) {
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
