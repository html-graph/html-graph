import { EdgeRenderParams } from "../../edge-render-params";
import {
  CycleSquareEdgePath,
  DetourVerticalEdgePath,
  VerticalEdgePath,
} from "../../paths";
import { Point } from "@/point";
import { VerticalEdgeParams } from "./vertical-edge-params";
import { edgeConstants } from "../../edge-constants";
import { EdgePathFactory, PathEdgeShape } from "../path-edge-shape";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../../structure-render-model";
import { resolveArrowRenderer } from "../../arrow-renderer";

export class VerticalEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly arrowLength: number;

  private readonly arrowWidth: number;

  private readonly arrowOffset: number;

  private readonly roundness: number;

  private readonly cycleSquareSide: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly pathShape: PathEdgeShape;

  private readonly createCyclePath: EdgePathFactory = (
    sourceDirection: Point,
  ) =>
    new CycleSquareEdgePath({
      sourceDirection,
      arrowLength: this.arrowLength,
      side: this.cycleSquareSide,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  private readonly createDetourPath: EdgePathFactory = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    flipX: number,
    flipY: number,
  ) =>
    new DetourVerticalEdgePath({
      to,
      sourceDirection,
      targetDirection,
      flipX,
      flipY,
      arrowLength: this.arrowLength,
      arrowOffset: this.arrowOffset,
      roundness: this.roundness,
      detourDistance: this.detourDistance,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  private readonly createLinePath: EdgePathFactory = (
    sourceDirection: Point,
    targetDirection: Point,
    to: Point,
    _flipX: number,
    flipY: number,
  ) =>
    new VerticalEdgePath({
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

    this.detourDistance =
      params?.detourDistance ?? edgeConstants.detourDistance;
    this.hasSourceArrow =
      params?.hasSourceArrow ?? edgeConstants.hasSourceArrow;
    this.hasTargetArrow =
      params?.hasTargetArrow ?? edgeConstants.hasTargetArrow;

    this.pathShape = new PathEdgeShape({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(
        params?.arrowRenderer ?? {
          type: "polygon",
          radius: this.arrowWidth,
        },
      ),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
    });

    this.svg = this.pathShape.svg;
    this.group = this.pathShape.group;
    this.line = this.pathShape.line;
    this.sourceArrow = this.pathShape.sourceArrow;
    this.targetArrow = this.pathShape.targetArrow;
    this.onAfterRender = this.pathShape.onAfterRender;
  }

  public render(params: EdgeRenderParams): void {
    this.pathShape.render(params);
  }
}
