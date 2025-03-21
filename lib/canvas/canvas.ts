import { Viewport } from "@/viewport-transformer";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchMatrixRequest } from "./patch-matrix-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { Graph } from "@/graph";

export interface Canvas {
  /**
   * provides api for accessing graph model
   */
  readonly graph: Graph;

  /**
   * provides api for accessing viewport state
   */
  readonly viewport: Viewport;

  /**
   * adds node to graph
   */
  addNode(node: AddNodeRequest): Canvas;

  /**
   * updates node absolute coordinates
   */
  updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas;

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(nodeId: unknown): Canvas;

  /**
   * marks element as port of node
   */
  markPort(port: MarkPortRequest): Canvas;

  /**
   * updates port and attached edges
   */
  updatePort(portId: unknown, request?: UpdatePortRequest): Canvas;

  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  unmarkPort(portId: unknown): Canvas;

  /**
   * adds edge to graph
   */
  addEdge(edge: AddEdgeRequest): Canvas;

  /**
   * updates edge
   */
  updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas;

  /**
   * removes edge from graph
   */
  removeEdge(edgeId: unknown): Canvas;

  /**
   * applies transformation for viewport
   */
  patchViewportMatrix(request: PatchMatrixRequest): Canvas;

  /**
   * applies transformation for content
   */
  patchContentMatrix(request: PatchMatrixRequest): Canvas;

  /**
   * attaches canvas to given element
   */
  attach(element: HTMLElement): Canvas;

  /**
   * detaches canvas from element
   */
  detach(): Canvas;

  /**
   * clears graph
   * graph gets rolled back to initial state
   * canvas can be reused
   */
  clear(): Canvas;

  /**
   * destroys canvas
   * canvas element gets rolled back to initial state
   * canvas can not be reused
   */
  destroy(): void;
}
