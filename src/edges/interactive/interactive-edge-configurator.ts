import { Canvas } from "@/canvas";
import { StructuredEdgeShape } from "../structured-edge-shape";
import { InteractiveEdgeParams } from "./interactive-edge-params";
import { InteractiveEdgeShape } from "./interactive-edge-shape";

export class InteractiveEdgeConfigurator {
  public constructor(private readonly canvas: Canvas) {}

  public configure(
    shape: StructuredEdgeShape,
    params: InteractiveEdgeParams,
  ): InteractiveEdgeShape {
    return new InteractiveEdgeShape(shape, params, this.canvas);
  }
}
