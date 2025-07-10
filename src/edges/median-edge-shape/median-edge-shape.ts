import { EventHandler } from "@/event-subject";
import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeRenderModel } from "../structure-render-model";
import { StructuredEdgeShape } from "../structured-edge-shape";

export class MedianEdgeShape implements StructuredEdgeShape {
  public readonly group: SVGGElement;

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null;

  public readonly targetArrow: SVGPathElement | null;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public readonly svg: SVGSVGElement;

  public constructor(
    private readonly baseShape: StructuredEdgeShape,
    public readonly median: SVGElement,
  ) {
    this.svg = this.baseShape.svg;
    this.group = this.baseShape.group;
    this.line = this.baseShape.line;
    this.sourceArrow = this.baseShape.sourceArrow;
    this.targetArrow = this.baseShape.targetArrow;
    this.onAfterRender = this.baseShape.onAfterRender;
    this.svg.append(this.median);

    this.baseShape.onAfterRender.subscribe((model) => {
      const median = model.edgePath.median;
      const transform = `translate(${median.x}px, ${median.y}px)`;

      this.median.style.setProperty("transform", transform);
    });
  }

  public render(params: EdgeRenderParams): void {
    this.baseShape.render(params);
  }
}
