import { PublicViewportTransformer } from "@/viewport-transformer";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchViewportRequest } from "./patch-viewport-request";
import { UpdateConnectionRequest } from "./update-edge-request";

export interface Canvas {
  /**
   * provides api for canvas transformation
   */
  readonly transformation: PublicViewportTransformer;

  /**
   * adds node to graph
   */
  addNode(node: AddNodeRequest): Canvas;

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the edges adjacent to node get removed
   */
  removeNode(nodeId: string): Canvas;

  /**
   * marks element as port of node
   */
  markPort(port: MarkPortRequest): Canvas;

  /**
   * updates edge attached to port
   */
  updatePortEdges(portId: string): Canvas;

  /**
   * ummarks element as port of node
   * all the edges adjacent to port get removed
   */
  unmarkPort(portId: string): Canvas;

  /**
   * adds edge to graph
   */
  addEdge(edge: AddEdgeRequest): Canvas;

  /**
   * removes edge from graph
   */
  removeEdge(edgeId: string): Canvas;

  /**
   * applies transformation for viewport
   */
  patchViewportState(request: PatchViewportRequest): Canvas;

  /**
   * moves viewport to nodes
   */
  moveToNodes(nodeIds: readonly string[]): Canvas;

  /**
   * updates node absolute coordinates
   */
  updateNodeCoordinates(nodeId: string, x: number, y: number): Canvas;

  /**
   * updates edge
   */
  updateConnection(edgeId: string, request: UpdateConnectionRequest): Canvas;

  /**
   * moves specified node on top
   */
  moveNodeOnTop(nodeId: string): Canvas;

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
   * canvas requires reinitialization in order to be used again
   */
  destroy(): void;
}
