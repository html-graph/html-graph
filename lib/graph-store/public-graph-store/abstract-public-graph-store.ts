import { GraphEdge } from "./graph-edge";
import { GraphNode } from "./graph-node";
import { GraphPort } from "./graph-port";

export interface AbstractPublicGraphStore {
  getAllNodeIds(): readonly unknown[];

  getAllPortIds(): readonly unknown[];

  getNode(nodeId: unknown): GraphNode | null;

  getNodePortIds(nodeId: unknown): readonly unknown[] | undefined;

  getPort(portId: unknown): GraphPort | null;

  getPortNodeId(portId: string): unknown | null;

  getAllEdgeIds(): readonly unknown[];

  getEdge(edgeId: unknown): GraphEdge | null;

  getPortAdjacentEdgeIds(portId: unknown): readonly unknown[];

  getNodeAdjacentEdgeIds(nodeId: unknown): readonly unknown[];

  getPortIncomingEdgeIds(portId: unknown): readonly unknown[];

  getPortOutcomingEdgeIds(portId: unknown): readonly unknown[];

  getPortCycleEdgeIds(portId: unknown): readonly unknown[];

  getNodeIncomingEdgeIds(nodeId: unknown): readonly unknown[];

  getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[];

  getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[];
}
