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
import { setSvgRectangle } from "../svg";
import { createDirectionVector } from "./create-direction-vector";
import { StructuredView } from "../structured-view";

export class PathEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  /**
   * @deprecated
   * use view.group instead
   */
  public readonly group: SVGGElement;

  /**
   * @deprecated
   * use view.line instead
   */
  public readonly line: SVGPathElement;

  /**
   * @deprecated
   * use view.sourceArrow instead
   */
  public readonly sourceArrow: SVGPathElement | null = null;

  /**
   * @deprecated
   * use view.targetArrow instead
   */
  public readonly targetArrow: SVGPathElement | null = null;

  public readonly view: StructuredView;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  private readonly arrowRenderer: ArrowRenderer;

  private readonly pathFnMapping: {
    [key in ConnectionCategory]: EdgePathFactory;
  };

  public constructor(private readonly params: PathEdgeParams) {
    this.view = new StructuredView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    this.pathFnMapping = {
      [ConnectionCategory.PortCycle]: this.params.createPortCyclePath,
      [ConnectionCategory.NodeCycle]: this.params.createNodeCyclePath,
      [ConnectionCategory.Line]: this.params.createLinePath,
    };

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    this.element = this.view.element;
    this.line = this.view.line;
    this.group = this.view.group;
    this.sourceArrow = this.view.sourceArrow;
    this.targetArrow = this.view.targetArrow;

    this.arrowRenderer = this.params.arrowRenderer;
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
        hasArrow: this.view.sourceArrow !== null,
      },
      {
        coords: to,
        dir: targetDirection,
        hasArrow: this.view.targetArrow !== null,
      },
    );

    this.view.line.setAttribute("d", edgePath.path);

    let sourceArrowPath: string | null = null;

    if (this.view.sourceArrow !== null) {
      sourceArrowPath = this.arrowRenderer({
        direction: sourceDirection,
        shift: from,
        arrowLength: this.params.arrowLength,
      });

      this.view.sourceArrow.setAttribute("d", sourceArrowPath);
    }

    let targetArrowPath: string | null = null;

    if (this.view.targetArrow !== null) {
      targetArrowPath = this.arrowRenderer({
        direction: targetVect,
        shift: to,
        arrowLength: this.params.arrowLength,
      });

      this.view.targetArrow.setAttribute("d", targetArrowPath);
    }

    this.afterRenderEmitter.emit({
      edgePath,
      sourceArrowPath,
      targetArrowPath,
    });
  }
}
