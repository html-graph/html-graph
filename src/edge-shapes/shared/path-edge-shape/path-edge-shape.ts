import { EdgeRenderParams } from "../edge-render-params";
import { PathEdgeParams } from "./path-edge-params";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeView } from "../structured-view";
import { PathEdgeModel } from "./path-edge-model";
import { updateStructuredView } from "../update-structured-view";

export class PathEdgeShape implements StructuredEdgeShape {
  public readonly element: SVGSVGElement;

  public readonly view: StructuredEdgeView;

  public readonly onModelChange: EventHandler<PathEdgeModel>;

  private readonly modelChangeEmitter: EventEmitter<PathEdgeModel>;

  public constructor(private readonly params: PathEdgeParams) {
    this.view = new StructuredEdgeView({
      color: params.color,
      width: params.width,
      hasSourceArrow: params.hasSourceArrow,
      hasTargetArrow: params.hasTargetArrow,
    });

    [this.modelChangeEmitter, this.onModelChange] = createPair<PathEdgeModel>();

    this.element = this.view.element;

    this.onModelChange.subscribe((model) => {
      updateStructuredView(this.view, model);
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
