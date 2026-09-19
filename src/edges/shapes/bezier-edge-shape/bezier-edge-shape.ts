import { EdgeRenderParams } from "../../edge-render-params";
import {
  BezierEdgePath,
  DetourBezierEdgePath,
  CycleCircleEdgePath,
} from "../../paths";
import { BezierEdgeParams } from "./bezier-edge-params";
import { edgeConstants } from "../../edge-constants";
import { EdgePathFactory, PathEdgeShape } from "../path-edge-shape";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../../structured-edge-render-model";
import { resolveArrowRenderer } from "../../arrow-renderer";
import { svgPadding } from "../../svg-padding";
import { EdgePort } from "../../edge-port";

export class BezierEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly arrowLength: number;

  private readonly curvature: number;

  private readonly portCycleRadius: number;

  private readonly portCycleSmallRadius: number;

  private readonly detourDirection: number;

  private readonly detourDistance: number;

  private readonly hasSourceArrow: boolean;

  private readonly hasTargetArrow: boolean;

  private readonly pathShape: PathEdgeShape;

  private readonly createCyclePath: EdgePathFactory = (from: EdgePort) =>
    new CycleCircleEdgePath({
      from,
      radius: this.portCycleRadius,
      smallRadius: this.portCycleSmallRadius,
      arrowLength: this.arrowLength,
      hasArrow: this.hasSourceArrow || this.hasTargetArrow,
    });

  private readonly createDetourPath: EdgePathFactory = (
    from: EdgePort,
    to: EdgePort,
  ) =>
    new DetourBezierEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      detourDir: this.detourDirection,
      detourDistance: this.detourDistance,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  private readonly createLinePath: EdgePathFactory = (
    from: EdgePort,
    to: EdgePort,
  ) =>
    new BezierEdgePath({
      from,
      to,
      arrowLength: this.arrowLength,
      curvature: this.curvature,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
    });

  public constructor(params?: BezierEdgeParams | undefined) {
    this.arrowLength = params?.arrowLength ?? edgeConstants.arrowLength;
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

    this.pathShape = new PathEdgeShape({
      color: params?.color ?? edgeConstants.color,
      width: params?.width ?? edgeConstants.width,
      arrowRenderer: resolveArrowRenderer(params?.arrowRenderer ?? {}),
      arrowLength: this.arrowLength,
      hasSourceArrow: this.hasSourceArrow,
      hasTargetArrow: this.hasTargetArrow,
      createCyclePath: this.createCyclePath,
      createDetourPath: this.createDetourPath,
      createLinePath: this.createLinePath,
      padding: svgPadding,
    });

    this.element = this.pathShape.element;
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
