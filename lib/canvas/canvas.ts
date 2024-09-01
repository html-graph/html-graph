import { DiContainer } from "../components/di-container/di-container";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
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
    this.di.controller.markPort(port.id, port.element, port.nodeId);

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
      connection.svgController ?? this.options.connections.controller,
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
