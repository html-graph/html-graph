import { EdgeRenderParams } from "@/edges/edge-render-params";
import { StructuredEdgeRenderModel } from "../../structured-edge-render-model";
import { EdgeElement } from "@/element";
import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { StructuredEdgeShape } from "../../structured-edge-shape";
import { OrthogonalEditableEdgeParams } from "./orthogonal-editable-edge-params";
import { createEdgePath, createEdgeSvg } from "../../svg";
import { edgeConstants } from "@/edges/edge-constants";

export class OrthogonalEditableEdgeShape implements StructuredEdgeShape {
  public readonly group = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  public readonly line: SVGPathElement;

  public readonly sourceArrow: SVGPathElement | null = null;

  public readonly targetArrow: SVGPathElement | null = null;

  private readonly afterRenderEmitter: EventEmitter<StructuredEdgeRenderModel>;

  public readonly onAfterRender: EventHandler<StructuredEdgeRenderModel>;

  public readonly element: EdgeElement;

  public constructor(
    private readonly params?: OrthogonalEditableEdgeParams | undefined,
  ) {
    this.element = createEdgeSvg(this.params?.color ?? edgeConstants.color);
    this.line = createEdgePath(this.params?.width ?? edgeConstants.width);

    [this.afterRenderEmitter, this.onAfterRender] =
      createPair<StructuredEdgeRenderModel>();
  }

  public render(params: EdgeRenderParams): void {
    console.log(params, this.afterRenderEmitter);
    throw new Error("Method not implemented.");
  }
}
