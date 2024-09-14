import { DiContainer } from "../components/di-container/di-container";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
import { ApiContentMoveTransform } from "../models/transform/api-content-move-transform";
import { ApiContentScaleTransform } from "../models/transform/api-content-scale-transform";
import { ApiTransform } from "../models/transform/api-transform";
import { createOptions } from "../utils/create-options/create-options";

/**
 * Provides API for acting on graph
 */
export class Canvas {
  private readonly options: Options;

  private readonly di: DiContainer;

  constructor(
    private readonly canvasWrapper: HTMLElement,
    private readonly apiOptions?: ApiOptions,
  ) {
    this.options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer(this.canvasWrapper, this.options);
  }

  /**
   * adds node to graph
   */
  addNode(node: ApiNode): Canvas {
    this.di.controller.addNode(
      node.id,
      node.element,
      node.x,
      node.y,
      node.ports,
      node.centerFn,
    );

    return this;
  }

  /**
   * removes node from graph
   * all the ports of node get unmarked
   * all the connections adjacent to node get removed
   */
  removeNode(nodeId: string): Canvas {
    this.di.controller.removeNode(nodeId);

    return this;
  }

  /**
   * marks element as port of node
   */
  markPort(port: ApiPort): Canvas {
    this.di.controller.markPort(
      port.id,
      port.element,
      port.nodeId,
      port.centerFn,
      port.direction,
    );

    return this;
  }

  /**
   * updates connections attached to port
   */
  updatePortConnections(portId: string): Canvas {
    this.di.controller.updatePortConnections(portId);

    return this;
  }

  /**
   * ummarks element as port of node
   * all the connections adjacent to port get removed
   */
  unmarkPort(portId: string): Canvas {
    this.di.controller.unmarkPort(portId);

    return this;
  }

  /**
   * adds connection to graph
   */
  addConnection(connection: ApiConnection): Canvas {
    this.di.controller.addConnection(
      connection.id,
      connection.from,
      connection.to,
      connection.options,
    );

    return this;
  }

  /**
   * removes connection from graph
   */
  removeConnection(connectionId: string): Canvas {
    this.di.controller.removeConnection(connectionId);

    return this;
  }

  /**
   * applies transformation for viewport
   */
  setViewportTransform(apiTransform: ApiTransform): Canvas {
    this.di.controller.patchViewportTransform(
      apiTransform.scale ?? null,
      apiTransform.x ?? null,
      apiTransform.y ?? null,
    );

    return this;
  }

  /**
   * applies move transformation for content
   */
  moveContent(apiTransform: ApiContentMoveTransform): Canvas {
    this.di.controller.moveContent(apiTransform.x ?? 0, apiTransform.y ?? 0);

    return this;
  }

  /**
   * applies scale transformation for content
   */
  scaleContent(apiTransform: ApiContentScaleTransform): Canvas {
    this.di.controller.scaleContent(
      apiTransform.scale ?? 1,
      apiTransform.x ?? 0,
      apiTransform.y ?? 0,
    );

    return this;
  }

  moveToNodes(nodeIds: readonly string[]): Canvas {
    this.di.controller.moveToNodes(nodeIds);

    return this;
  }

  /**
   * clears graph
   * graph gets rolled back to initial state
   * canvas can be reused
   */
  clear(): Canvas {
    this.di.controller.clear();

    return this;
  }

  /**
   * destroys canvas
   * canvas element gets rolled back to initial state
   * canvas requires reinitialization in order to be used again
   */
  destroy(): void {
    this.di.controller.destroy();
  }
}
