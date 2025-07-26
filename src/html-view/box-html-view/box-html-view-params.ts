export interface BoxHtmlViewParams {
  readonly onBeforeNodeAttached: (nodeId: unknown) => void;
  readonly onAfterNodeDetached: (nodeId: unknown) => void;
}
