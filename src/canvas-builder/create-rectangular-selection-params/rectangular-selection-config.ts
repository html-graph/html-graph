import { MouseEventVerifier } from "@/configurators";

export interface RectangularSelectionConfig {
  readonly rectangleElement?: Element;
  readonly mouseDownEventVerifier?: MouseEventVerifier;
  readonly mouseUpEventVerifier?: MouseEventVerifier;
  readonly onSelectionStarted?: () => void;
  readonly onSelectionChange?: (selectionRectangle: DOMRect) => void;
  readonly onSelectionInterrupted?: (selectionRectangle: DOMRect) => void;
  readonly onSelectionFinished?: (selectionRectangle: DOMRect) => void;
}
