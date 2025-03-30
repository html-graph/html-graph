import { Viewport } from "@/viewport";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchMatrixRequest } from "./patch-matrix-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { Graph } from "@/graph";

export interface CanvasController {
  readonly graph: Graph;

  readonly viewport: Viewport;

  attach(element: HTMLElement): void;

  detach(): void;

  addNode(node: AddNodeRequest): void;

  updateNode(nodeId: unknown, request: UpdateNodeRequest): void;

  removeNode(nodeId: unknown): void;

  markPort(port: MarkPortRequest): void;

  updatePort(portId: unknown, request: UpdatePortRequest): void;

  unmarkPort(portId: unknown): void;

  addEdge(edge: AddEdgeRequest): void;

  updateEdge(edgeId: unknown, request: UpdateEdgeRequest): void;

  removeEdge(edgeId: unknown): void;

  patchViewportMatrix(request: PatchMatrixRequest): void;

  patchContentMatrix(request: PatchMatrixRequest): void;

  clear(): void;

  destroy(): void;
}
