import { MouseEventVerifier } from "../shared";

export interface RectangularSelectionParams {
  readonly rectangleElement: Element;
  readonly mouseDownEventVerifier: MouseEventVerifier;
  readonly mouseUpEventVerifier: MouseEventVerifier;
  readonly onSelectionStarted: () => void;
  readonly onSelectionChange: (selectionRectangle: DOMRect) => void;
  readonly onSelectionInterrupted: (selectionRectangle: DOMRect) => void;
  readonly onSelectionFinished: (selectionRectangle: DOMRect) => void;
}
