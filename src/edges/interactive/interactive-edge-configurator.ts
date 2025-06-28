import { StructuredEdgeShape } from "../structured-edge-shape";
import { InteractiveEdgeParams } from "./interactive-edge-params";
import { InteractiveEdgeShape } from "./interactive-edge-shape";

export class InteractiveEdgeConfigurator {
  public static configure(
    shape: StructuredEdgeShape,
    params: InteractiveEdgeParams,
  ): InteractiveEdgeShape {
    return new InteractiveEdgeShape(shape, params);
  }
}
