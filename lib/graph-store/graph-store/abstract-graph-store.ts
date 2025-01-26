import { CenterFn } from "@/center-fn";
import { EdgeShape } from "@/edges";
import { EdgePayload } from "./edge-payload";
import { NodePayload } from "./node-payload";
import { PortPayload } from "./port-payload";

export interface AbstractGraphStore {
  addNode(
    nodeId: unknown,
    element: HTMLElement,
    x: number,
    y: number,
    centerFn: CenterFn,
    priority: number,
  ): void;

  getAllNodeIds(): readonly unknown[];

  getNode(nodeId: unknown): NodePayload | undefined;

  removeNode(nodeId: unknown): void;

  addPort(
    portId: unknown,
    element: HTMLElement,
    nodeId: unknown,
    centerFn: CenterFn,
    dir: number,
  ): void;

  getPort(portId: unknown): PortPayload | undefined;

  getAllPortIds(): readonly unknown[];

  getNodePortIds(nodeId: unknown): readonly unknown[] | undefined;

  getPortNodeId(portId: unknown): unknown | undefined;

  removePort(portId: unknown): void;

  addEdge(
    edgeId: unknown,
    fromPortId: unknown,
    toPortId: unknown,
    shape: EdgeShape,
    priority: number,
  ): void;

  getAllEdgeIds(): readonly unknown[];

  getEdge(edgeId: unknown): EdgePayload | undefined;

  removeEdge(edgeId: unknown): void;

  clear(): void;

  getPortIncomingEdgeIds(portId: unknown): readonly unknown[];

  getPortOutcomingEdgeIds(portId: unknown): readonly unknown[];

  getPortCycleEdgeIds(portId: unknown): readonly unknown[];

  getPortAdjacentEdgeIds(portId: unknown): readonly unknown[];

  getNodeIncomingEdgeIds(nodeId: unknown): readonly unknown[];

  getNodeOutcomingEdgeIds(nodeId: unknown): readonly unknown[];

  getNodeCycleEdgeIds(nodeId: unknown): readonly unknown[];

  getNodeAdjacentEdgeIds(nodeId: unknown): readonly unknown[];
}
