export interface DragOptions {
  events?: {
    onNodeDrag?: (nodeId: string) => void;
  };
}
