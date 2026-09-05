export interface RectangularSelectionConfig {
  readonly rectangleElement?: Element;
  readonly onSelectionStarted?: () => void;
  readonly onSelectionChange?: (selectionRectangle: DOMRect) => void;
  readonly onSelectionInterrupted?: (selectionRectangle: DOMRect) => void;
  readonly onSelectionFinished?: (selectionRectangle: DOMRect) => void;
}
