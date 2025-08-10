import { EdgeRenderParams } from "../../edge-render-params";
import { Point, zero } from "@/point";
import { PathEdgeParams } from "./path-edge-params";
import { createFlipDirectionVector } from "./create-flip-direction-vector";
import { EdgePathFactory } from "./edge-path-factory";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { createEdgeRectangle } from "../../geometry";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../../structure-render-model";
import { ConnectionCategory } from "../../connection-category";
import { ArrowRenderer } from "../../arrow-renderer";
import {
  createEdgeArrow,
  createEdgeGroup,
  createEdgePath,
  createEdgeSvg,
  setSvgRectangle,
} from "../../svg";

export class PathEdgeShape implements StructuredEdgeShape {
  public readonly svg: SVGSVGElement;

  public readonly group = createEdgeGroup();

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  public constructor(private readonly params: PathEdgeParams) {
    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.arrowRenderer = this.params.arrowRenderer;

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

    let targetVect: Point = { x: -targetDirection.x, y: -targetDirection.y };
    let createPathFn: EdgePathFactory;

    if (params.category === ConnectionCategory.PortCycle) {
      createPathFn = this.params.createCyclePath;
      targetVect = sourceDirection;
    } else if (params.category === ConnectionCategory.NodeCycle) {
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
      sourceArrowPath = this.arrowRenderer({
        direction: sourceDirection,
        shift: zero,
        arrowLength: this.params.arrowLength,
      });

      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    let targetArrowPath: string | null = null;

    if (this.targetArrow) {
      targetArrowPath = this.arrowRenderer({
        direction: targetVect,
        shift: to,
        arrowLength: this.params.arrowLength,
      });

      this.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
