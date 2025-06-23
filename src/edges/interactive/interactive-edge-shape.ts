import { EdgeRenderParams } from "../edge-render-params";
import { StructuredEdgeShape } from "../structured-edge-shape";

export class InteractiveEdgeShape implements StructuredEdgeShape {
  public readonly svg = this.structuredEdge.svg;

  public readonly group = this.structuredEdge.group;

  public readonly line = this.structuredEdge.line;

  public constructor(private readonly structuredEdge: StructuredEdgeShape) {}

  public render(params: EdgeRenderParams): void {
    this.structuredEdge.render(params);
  }
}
