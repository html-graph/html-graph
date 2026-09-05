export interface RectangularSelectionParams {
  readonly onSelectionFinished: (selectionRectangle: DOMRect) => void;
  readonly onSelectionChange: (selectionRectangle: DOMRect) => void;
  readonly onSelectionInterrupted: (selectionRectangle: DOMRect) => void;
}
