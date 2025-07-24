import { EdgeRenderParams } from "../edge-render-params";
import { Point, zero } from "@/point";
import { PathEdgeParams } from "./path-edge-params";
import { createFlipDirectionVector } from "./create-flip-direction-vector";
import { EdgePathFactory } from "./edge-path-factory";
import { StructuredEdgeShape } from "../structured-edge-shape";
import {
  createArrowPath,
  createEdgeArrow,
  createEdgeGroup,
  createEdgePath,
  createEdgeRectangle,
  createEdgeSvg,
  setSvgRectangle,
} from "../shared";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../structure-render-model";

export class PathEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group = createEdgeGroup();

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public constructor(private readonly params: PathEdgeParams) {
    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.svg = createEdgeSvg(params.color);
    this.svg.appendChild(this.group);
    this.line = createEdgePath(params.width);
    this.group.appendChild(this.line);

    if (params.hasSourceArrow) {
      this.sourceArrow = createEdgeArrow();
      this.group.appendChild(this.sourceArrow);
    }

    if (params.hasTargetArrow) {
      this.targetArrow = createEdgeArrow();
      this.group.appendChild(this.targetArrow);
    }
  }

  public render(params: EdgeRenderParams): void {
    const { x, y, width, height, flipX, flipY } = createEdgeRectangle(
      params.from,
      params.to,
    );

    setSvgRectangle(this.svg, { x, y, width, height });
    this.group.style.transform = `scale(${flipX}, ${flipY})`;

    const sourceDirection = createFlipDirectionVector(
      params.from.direction,
      flipX,
      flipY,
    );

    const targetDirection = createFlipDirectionVector(
      params.to.direction,
      flipX,
      flipY,
    );

    const to: Point = {
      x: width,
      y: height,
    };

    let targetVect = targetDirection;
    let targetArrowLength = -this.params.arrowLength;
    let createPathFn: EdgePathFactory;

    if (params.from.portId === params.to.portId) {
      createPathFn = this.params.createCyclePath;
      targetVect = sourceDirection;
      targetArrowLength = this.params.arrowLength;
    } else if (params.from.nodeId === params.to.nodeId) {
      createPathFn = this.params.createDetourPath;
    } else {
      createPathFn = this.params.createLinePath;
    }

    const edgePath = createPathFn(
      sourceDirection,
      targetDirection,
      to,
      flipX,
      flipY,
    );

    this.line.setAttribute("d", edgePath.path);

    let sourceArrowPath: string | null = null;

    if (this.sourceArrow) {
      sourceArrowPath = createArrowPath(
        sourceDirection,
        zero,
        this.params.arrowLength,
        this.params.arrowWidth,
      );

      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    let targetArrowPath: string | null = null;

    if (this.targetArrow) {
      targetArrowPath = createArrowPath(
        targetVect,
        to,
        targetArrowLength,
        this.params.arrowWidth,
      );

      this.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
