export interface RectangularSelectionParams {
  readonly onSelectionStarted: () => void;
  readonly onSelectionChange: (selectionRectangle: DOMRect) => void;
  readonly onSelectionInterrupted: (selectionRectangle: DOMRect) => void;
  readonly onSelectionFinished: (selectionRectangle: DOMRect) => void;
}
