import { ConnectionController } from "@/connections";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { AddConnectionRequest } from "./add-connection-request";
import { AddNodeRequest } from "./add-node-request";
import { ApiContentMoveTransform } from "./api-content-move-transform";
import { ApiContentScaleTransform } from "./api-content-scale-transform";
import { ApiPort } from "./api-port";
import { ApiTransform } from "./api-transform";

export interface Canvas {
  /**
   * provides api for canvas transformation
   */
  readonly transformation: PublicViewportTransformer;

  /**
   * provides api for graph structure access
   */
  readonly model: PublicGraphStore;

  /**
   * adds node to graph
   */
  addNode(node: AddNodeRequest): Canvas;

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the connections adjacent to node get removed
   */
  removeNode(nodeId: string): Canvas;

  /**
   * marks element as port of node
   */
  markPort(port: ApiPort): Canvas;

  /**
   * updates connections attached to port
   */
  updatePortConnections(portId: string): Canvas;

  /**
   * ummarks element as port of node
   * all the connections adjacent to port get removed
   */
  unmarkPort(portId: string): Canvas;

  /**
   * adds connection to graph
   */
  addConnection(connection: AddConnectionRequest): Canvas;

  /**
   * removes connection from graph
   */
  removeConnection(connectionId: string): Canvas;

  /**
   * applies transformation for viewport
   */
  patchViewportTransform(apiTransform: ApiTransform): Canvas;

  /**
   * applies move transformation for content
   */
  moveContent(apiTransform: ApiContentMoveTransform): Canvas;

  /**
   * applies scale transformation for content
   */
  scaleContent(apiTransform: ApiContentScaleTransform): Canvas;

  /**
   * applies shift transformation for content
   */
  moveToNodes(nodeIds: readonly string[]): Canvas;

  /**
   * updates node absolute coordinates
   */
  updateNodeCoords(nodeId: string, x: number, y: number): Canvas;

  /**
   * updates connection
   */
  updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): Canvas;

  /**
   * drags node in viewport
   */
  dragNode(nodeId: string, dx: number, dy: number): Canvas;

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
