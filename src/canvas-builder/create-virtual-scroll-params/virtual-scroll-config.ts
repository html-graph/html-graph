export interface VirtualScrollConfig {
  readonly nodeContainingRadius: {
    readonly vertical: number;
    readonly horizontal: number;
  };
  readonly events?: {
    readonly onBeforeNodeAttached?: (nodeId: unknown) => void;
    readonly onAfterNodeDetached?: (nodeId: unknown) => void;
  };
}
