import { EdgeRenderParams } from "../edge-render-params";
import { CycleSquareLine, DetourStraightLine, VerticalLine } from "../shared";
import { Point } from "@/point";
import { VerticalEdgeParams } from "./vertical-edge-params";
import { edgeConstants } from "../edge-constants";
import { CreatePathFn, LineEdgeShape } from "../line";
import { StructuredEdgeShape } from "../structured-edge-shape";

// Responsibility: Providing edge shape connecting ports with vertical angled
// line
export class VerticalEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly lineShape: LineEdgeShape;

  private readonly createCyclePath: CreatePathFn = (
    sourceDirection: Point,
  ): string => {
    const line = new CycleSquareLine({
      sourceDirection,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

    return line.getPath();
  };

  private readonly createDetourPath: CreatePathFn = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ): string => {
    const line = new DetourStraightLine({
      to,
      sourceDirection,
      targetDirection,
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

    return line.getPath();
  };

  private readonly createLinePath: CreatePathFn = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    _flipX: number,
    flipY: number,
  ): string => {
    const line = new VerticalLine({
      to,
      sourceDirection,
      targetDirection,
      flipY,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

    return line.getPath();
  };

  public constructor(params?: VerticalEdgeParams) {
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
      params?.detourDirection ?? edgeConstants.detourDirectionVertical;
    this.detourDistance =
      params?.detourDistance ?? edgeConstants.detourDistance;
    this.hasSourceArrow =
      params?.hasSourceArrow ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow =
      params?.hasTargetArrow ?? edgeConstants.hasTargetArrow;

    this.lineShape = new LineEdgeShape({
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

    this.svg = this.lineShape.svg;
    this.group = this.lineShape.group;
    this.line = this.lineShape.line;
    this.sourceArrow = this.lineShape.sourceArrow;
    this.targetArrow = this.lineShape.targetArrow;
  }

  public render(params: EdgeRenderParams): void {
    this.lineShape.render(params);
  }
}
