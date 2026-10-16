import { Point } from "@/point";
import {
  EdgeBox,
  StructuredEdgeModel,
  EdgeRenderParams,
  createEdgeRectangle,
  ConnectionCategory,
  createDirectionVector,
  EdgePathFactory,
  PathPort,
  CycleCircleEdgePath,
  DetourBezierEdgePath,
  BezierEdgePath,
  svgPadding,
  EdgePath,
  adjustTargetVector,
} from "../../shared";
import { BezierEdgeModelShapeParams } from "./bezier-edge-model-shape-params";

export class BezierEdgeModel implements StructuredEdgeModel {
  public readonly box: EdgeBox;

  public readonly linePath: string;

  public readonly sourceArrowPath: string = "";

  public readonly targetArrowPath: string = "";

  public readonly shapeSourcePoint: Point;

  public readonly shapeTargetPoint: Point;

  private readonly portCyclePathFn: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new CycleCircleEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      radius: this.shapeParams.portCycleRadius,
      smallRadius: this.shapeParams.portCycleSmallRadius,
    });

  private readonly nodeCyclePathFn: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourBezierEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      curvature: this.shapeParams.curvature,
      detourDir: this.shapeParams.detourDirection,
      detourDistance: this.shapeParams.detourDistance,
    });

  private readonly linePathFn: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new BezierEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      curvature: this.shapeParams.curvature,
    });

  private readonly pathFnMapping: {
    [key in ConnectionCategory]: EdgePathFactory;
  } = {
    [ConnectionCategory.PortCycle]: this.portCyclePathFn,
    [ConnectionCategory.NodeCycle]: this.nodeCyclePathFn,
    [ConnectionCategory.Line]: this.linePathFn,
  };

  private readonly edgePath: EdgePath;

  public constructor(
    private readonly renderParams: EdgeRenderParams,
    private readonly shapeParams: BezierEdgeModelShapeParams,
  ) {
    const { box, from, to } = createEdgeRectangle(
      this.renderParams.from,
      this.renderParams.to,
      svgPadding,
    );

    this.box = box;
    this.shapeSourcePoint = from;
    this.shapeTargetPoint = to;

    const sourceVector = createDirectionVector(
      this.renderParams.from.direction,
    );
    const targetVector = createDirectionVector(this.renderParams.to.direction);

    this.edgePath = this.pathFnMapping[this.renderParams.category](
      {
        coords: from,
        dir: sourceVector,
        hasArrow: this.shapeParams.hasSourceArrow,
      },
      {
        coords: to,
        dir: targetVector,
        hasArrow: this.shapeParams.hasTargetArrow,
      },
    );

    this.linePath = this.edgePath.path;

    if (this.shapeParams.hasSourceArrow) {
      this.sourceArrowPath = this.shapeParams.arrowRenderer({
        direction: sourceVector,
        shift: from,
        arrowLength: this.shapeParams.arrowLength,
      });
    }

    if (this.shapeParams.hasTargetArrow) {
      this.targetArrowPath = this.shapeParams.arrowRenderer({
        direction: adjustTargetVector(
          sourceVector,
          targetVector,
          this.renderParams.category,
        ),
        shift: to,
        arrowLength: this.shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return this.edgePath.calculateMidpoint();
  }
}
