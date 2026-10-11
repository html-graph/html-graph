import { Point } from "@/point";
import {
  EdgeBox,
  StructuredEdgeModel,
  EdgeRenderParams,
  createEdgeRectangle,
  ConnectionCategory,
  createDirectionVector,
  EdgePathFactory,
  EdgePath,
  svgPadding,
  PathPort,
  CycleSquareEdgePath,
  DetourOrthogonalEdgePath,
  OrthogonalEdgePath,
} from "../../shared";
import { OrthogonalEdgeModelShapeParams } from "./orthogonal-edge-model-shape-params";
import { orthogonalizeDirection } from "./orthogonalize-direction";

export class OrthogonalEdgeModel implements StructuredEdgeModel {
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
    new CycleSquareEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      arrowOffset: this.shapeParams.arrowOffset,
      roundness: this.shapeParams.roundness,
      side: this.shapeParams.cycleSquareSide,
    });

  private readonly nodeCyclePathFn: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new DetourOrthogonalEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      arrowOffset: this.shapeParams.arrowOffset,
      roundness: this.shapeParams.roundness,
      detourDistance: this.shapeParams.detourDistance,
    });

  private readonly linePathFn: EdgePathFactory = (
    from: PathPort,
    to: PathPort,
  ) =>
    new OrthogonalEdgePath({
      from,
      to,
      arrowLength: this.shapeParams.arrowLength,
      arrowOffset: this.shapeParams.arrowOffset,
      roundness: this.shapeParams.roundness,
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
    private readonly shapeParams: OrthogonalEdgeModelShapeParams,
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
      orthogonalizeDirection(this.renderParams.from.direction),
    );

    const targetVector = createDirectionVector(
      orthogonalizeDirection(this.renderParams.to.direction),
    );

    const createPathFn = this.pathFnMapping[this.renderParams.category];

    this.edgePath = createPathFn(
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
      const adjustedtargetVector: Point =
        this.renderParams.category === ConnectionCategory.PortCycle
          ? sourceVector
          : { x: -targetVector.x, y: -targetVector.y };

      this.targetArrowPath = this.shapeParams.arrowRenderer({
        direction: adjustedtargetVector,
        shift: to,
        arrowLength: this.shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return this.edgePath.calculateMidpoint();
  }
}
