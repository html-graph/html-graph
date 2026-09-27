import { Point } from "@/point";
import { EdgeBox } from "../../edge-box";
import { StructuredEdgeModel } from "../../structured-edge-shape-model";
import { EdgeRenderParams } from "../../edge-render-params";
import { PathEdgeModelShapeParams } from "./path-edge-model-shape-params";
import { createEdgeRectangle } from "../../geometry";
import { createDirectionVector } from "../create-direction-vector";
import { ConnectionCategory } from "../../connection-category";

export class PathEdgeModel implements StructuredEdgeModel {
  public readonly box: EdgeBox;

  public readonly linePath: string;

  public readonly sourceArrowPath: string = "";

  public readonly targetArrowPath: string = "";

  public readonly sourcePoint: Point;

  public readonly targetPoint: Point;

  private readonly midpoint: Point;

  public constructor(
    renderParams: EdgeRenderParams,
    shapeParams: PathEdgeModelShapeParams,
  ) {
    const { box, from, to } = createEdgeRectangle(
      renderParams.from,
      renderParams.to,
      shapeParams.padding,
    );

    this.box = box;
    this.sourcePoint = from;
    this.targetPoint = to;

    const sourceDirection = createDirectionVector(renderParams.from.direction);
    const targetDirection = createDirectionVector(renderParams.to.direction);

    const targetVect: Point =
      renderParams.category === ConnectionCategory.PortCycle
        ? sourceDirection
        : { x: -targetDirection.x, y: -targetDirection.y };

    const pathFnMapping = {
      [ConnectionCategory.PortCycle]: shapeParams.createPortCyclePath,
      [ConnectionCategory.NodeCycle]: shapeParams.createNodeCyclePath,
      [ConnectionCategory.Line]: shapeParams.createLinePath,
    };

    const createPathFn = pathFnMapping[renderParams.category];

    const edgePath = createPathFn(
      {
        coords: from,
        dir: sourceDirection,
        hasArrow: shapeParams.hasSourceArrow,
      },
      {
        coords: to,
        dir: targetDirection,
        hasArrow: shapeParams.hasTargetArrow,
      },
    );

    this.linePath = edgePath.path;
    this.midpoint = edgePath.midpoint;

    if (shapeParams.hasSourceArrow) {
      this.sourceArrowPath = shapeParams.arrowRenderer({
        direction: sourceDirection,
        shift: from,
        arrowLength: shapeParams.arrowLength,
      });
    }

    if (shapeParams.hasTargetArrow) {
      this.targetArrowPath = shapeParams.arrowRenderer({
        direction: targetVect,
        shift: to,
        arrowLength: shapeParams.arrowLength,
      });
    }
  }

  public calculateMidpoint(): Point {
    return this.midpoint;
  }
}
