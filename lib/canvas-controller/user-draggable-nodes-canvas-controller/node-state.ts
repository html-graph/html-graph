export interface NodeState {
  readonly element: HTMLElement;
  readonly onMouseDown: (event: MouseEvent) => void;
  readonly onTouchStart: (event: TouchEvent) => void;
}
