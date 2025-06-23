import { EdgeShape } from "./edge-shape";

/**
 * Responsibility: Attaching interactive behavior to an EdgeShape
 */
export interface StructuredEdgeShape extends EdgeShape {
  readonly group: SVGGElement;
  readonly line: SVGPathElement;
}
