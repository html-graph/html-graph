export interface InteractiveEdgeParams {
  readonly width: number;
  readonly onInteractionStart: () => void;
  readonly onInteractionEnd: () => void;
}
