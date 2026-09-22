import { EdgeRenderParams } from "../edge-render-params";
import { Point } from "@/point";
import { PathEdgeParams } from "./path-edge-params";
import { EdgePathFactory } from "./edge-path-factory";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createEdgeRectangle } from "../geometry";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../structured-edge-render-model";
import { ConnectionCategory } from "../connection-category";
import { ArrowRenderer } from "../arrow-renderer";
import {
  createEdgeArrow,
  createEdgePath,
  createEdgeSvg,
  setSvgRectangle,
} from "../svg";
import { createDirectionVector } from "./create-direction-vector";
import { createInteractionHandle } from "./create-interaction-handle";

export class PathEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly group = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  private readonly pathFnMapping: {
    [key in ConnectionCategory]: EdgePathFactory;
  };

  private interactionHandle: SVGGElement | null = null;

  public constructor(private readonly params: PathEdgeParams) {
    this.pathFnMapping = {
      [ConnectionCategory.PortCycle]: this.params.createPortCyclePath,
      [ConnectionCategory.NodeCycle]: this.params.createNodeCyclePath,
      [ConnectionCategory.Line]: this.params.createLinePath,
    };

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.arrowRenderer = this.params.arrowRenderer;

    this.element = createEdgeSvg(params.color);
    this.element.appendChild(this.group);
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
    const { x, y, width, height, from, to } = createEdgeRectangle(
      params.from,
      params.to,
      this.params.padding,
    );

    setSvgRectangle(this.element, { x, y, width, height });

    const sourceDirection = createDirectionVector(params.from.direction);
    const targetDirection = createDirectionVector(params.to.direction);

    const targetVect: Point =
      params.category === ConnectionCategory.PortCycle
        ? sourceDirection
        : { x: -targetDirection.x, y: -targetDirection.y };

    const createPathFn = this.pathFnMapping[params.category];

    const edgePath = createPathFn(
      {
        coords: from,
        dir: sourceDirection,
        hasArrow: this.sourceArrow !== null,
      },
      {
        coords: to,
        dir: targetDirection,
        hasArrow: this.targetArrow !== null,
      },
    );

    this.line.setAttribute("d", edgePath.path);

    let sourceArrowPath: string | null = null;

    if (this.sourceArrow !== null) {
      sourceArrowPath = this.arrowRenderer({
        direction: sourceDirection,
        shift: from,
        arrowLength: this.params.arrowLength,
      });

      this.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    let targetArrowPath: string | null = null;

    if (this.targetArrow !== null) {
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

  public enableInteraction(): void {
    if (this.interactionHandle !== null) {
      return;
    }

    this.interactionHandle = createInteractionHandle();
    this.element.appendChild(this.interactionHandle);
  }

  public disableInteraction(): void {
    if (this.interactionHandle === null) {
      return;
    }

    this.element.removeChild(this.interactionHandle);
    this.interactionHandle = null;
  }
}
