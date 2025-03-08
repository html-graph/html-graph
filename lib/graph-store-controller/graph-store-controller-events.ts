export interface GraphStoreControllerEvents {
  readonly onAfterNodeAdded: (nodeId: unknown) => void;
  readonly onAfterEdgeAdded: (edgeId: unknown) => void;
  readonly onAfterEdgeShapeUpdated: (edgeId: unknown) => void;
  readonly onAfterEdgePriorityUpdated: (edgeId: unknown) => void;
  readonly onAfterEdgeUpdated: (edgeId: unknown) => void;
  readonly onAfterPortUpdated: (portId: unknown) => void;
  readonly onAfterNodePriorityUpdated: (nodeId: unknown) => void;
  readonly onAfterNodeUpdated: (nodeId: unknown) => void;
  readonly onBeforeEdgeRemoved: (edgeId: unknown) => void;
  readonly onBeforeNodeRemoved: (nodeId: unknown) => void;
}
