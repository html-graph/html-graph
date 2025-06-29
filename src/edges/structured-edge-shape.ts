import { EdgeShape } from "./edge-shape";

/**
 * Responsibility: Specifying EdgeShape with a standard visual structure
 */
export interface StructuredEdgeShape extends EdgeShape {
  readonly group: SVGGElement;
  readonly line: SVGPathElement;
  readonly sourceArrow: SVGPathElement | null;
  readonly targetArrow: SVGPathElement | null;
}
