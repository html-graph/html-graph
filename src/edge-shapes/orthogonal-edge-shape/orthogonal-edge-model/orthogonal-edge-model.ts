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

    const pathFnMapping: { [key in ConnectionCategory]: EdgePathFactory } = {
      [ConnectionCategory.PortCycle]: this.shapeParams.createPortCyclePath,
      [ConnectionCategory.NodeCycle]: this.shapeParams.createNodeCyclePath,
      [ConnectionCategory.Line]: this.shapeParams.createLinePath,
    };

    const createPathFn = pathFnMapping[this.renderParams.category];

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
