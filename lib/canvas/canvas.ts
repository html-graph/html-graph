import { ApiConnection } from "../models/connection/api-connection";
import { ApiUpdateConnection } from "../models/connection/api-update-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiPort } from "../models/port/api-port";
import { ApiContentMoveTransform } from "../models/transform/api-content-move-transform";
import { ApiContentScaleTransform } from "../models/transform/api-content-scale-transform";
import { ApiTransform } from "../models/transform/api-transform";

export type Canvas = SelfRefCanvas<Canvas>;

interface SelfRefCanvas<T extends SelfRefCanvas<T>> {
  /**
   * adds node to graph
   */
  addNode(node: ApiNode): T;

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the connections adjacent to node get removed
   */
  removeNode(nodeId: string): T;

  /**
   * marks element as port of node
   */
  markPort(port: ApiPort): T;

  /**
   * updates connections attached to port
   */
  updatePortConnections(portId: string): T;

  /**
   * ummarks element as port of node
   * all the connections adjacent to port get removed
   */
  unmarkPort(portId: string): T;

  /**
   * adds connection to graph
   */
  addConnection(connection: ApiConnection): T;

  /**
   * removes connection from graph
   */
  removeConnection(connectionId: string): T;

  /**
   * applies transformation for viewport
   */
  patchViewportTransform(apiTransform: ApiTransform): T;

  /**
   * applies move transformation for content
   */
  moveContent(apiTransform: ApiContentMoveTransform): T;

  /**
   * applies scale transformation for content
   */
  scaleContent(apiTransform: ApiContentScaleTransform): T;

  /**
   * applies shift transformation for content
   */
  moveToNodes(nodeIds: readonly string[]): T;

  /**
   * updates node absolute coordinates
   */
  updateNodeCoords(nodeId: string, x: number, y: number): T;

  /**
   * updates connection
   */
  updateConnectionOptions(
    connectionId: string,
    options: ApiUpdateConnection,
  ): T;

  /**
   * drags node in viewport
   */
  dragNode(nodeId: string, dx: number, dy: number): T;

  /**
   * attaches canvas to given element
   */
  attach(element: HTMLElement): T;

  /**
   * detaches canvas from element
   */
  detach(): T;

  /**
   * clears graph
   * graph gets rolled back to initial state
   * canvas can be reused
   */
  clear(): T;

  /**
   * destroys canvas
   * canvas element gets rolled back to initial state
   * canvas requires reinitialization in order to be used again
   */
  destroy(): void;

  /**
   * moves specified node on top
   */
  moveNodeOnTop(nodeId: string): T;
}
