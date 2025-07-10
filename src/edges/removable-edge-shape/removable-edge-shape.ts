import { EventHandler } from "@/event-subject";
import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeRenderModel } from "../structure-render-model";
import { StructuredEdgeShape } from "../structured-edge-shape";

export class RemovableEdgeShape implements StructuredEdgeShape {
  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public readonly svg: SVGSVGElement;

  public constructor(
    private readonly baseShape: StructuredEdgeShape,
    private readonly edgeId: unknown,
  ) {
    this.svg = this.baseShape.svg;
    this.group = this.baseShape.group;
    this.line = this.baseShape.line;
    this.sourceArrow = this.baseShape.sourceArrow;
    this.targetArrow = this.baseShape.targetArrow;
    this.onAfterRender = this.baseShape.onAfterRender;

    this.baseShape.onAfterRender.subscribe((model) => {
      console.log(this.edgeId, model);
    });
  }

  public render(params: EdgeRenderParams): void {
    this.baseShape.render(params);
  }
}
