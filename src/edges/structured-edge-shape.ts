import { EdgeShape } from "./edge-shape";

export interface StructuredEdgeShape extends EdgeShape {
  readonly group: SVGGElement;
  readonly line: SVGPathElement;
}
