import { EdgeRenderParams } from "../edge-render-params";
import { PathEdgeParams } from "./path-edge-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeRenderModel } from "../structured-edge-render-model";
import { StructuredEdgeView } from "../structured-view";
import { PathEdgeModel } from "./path-edge-model";
import { updateStructuredView } from "../update-structured-view";

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

  public readonly view: StructuredEdgeView;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public readonly onModelChange: EventHandler<PathEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<PathEdgeModel>;

  public constructor(private readonly params: PathEdgeParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();

    [this.modelChangeEmitter, this.onModelChange] = createPair<PathEdgeModel>();

    this.element = this.view.element;
    this.line = this.view.line;
    this.group = this.view.group;
    this.sourceArrow = this.view.sourceArrow;
    this.targetArrow = this.view.targetArrow;

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);

      this.afterRenderEmitter.emit({
        edgePath: {
          path: model.linePath,
          midpoint: model.calculateMidpoint(),
        },
        sourceArrowPath: model.sourceArrowPath,
        targetArrowPath: model.targetArrowPath,
      });
    });
  }

  public render(params: EdgeRenderParams): void {
    const model = new PathEdgeModel(params, {
      createLinePath: this.params.createLinePath,
      createNodeCyclePath: this.params.createNodeCyclePath,
      createPortCyclePath: this.params.createPortCyclePath,
      hasSourceArrow: this.params.hasSourceArrow,
      hasTargetArrow: this.params.hasTargetArrow,
      arrowRenderer: this.params.arrowRenderer,
      arrowLength: this.params.arrowLength,
      padding: this.params.padding,
    });

    this.modelChangeEmitter.emit(model);
  }
}
