import { DiContainer } from "../components/di-container/di-container";
import { defaultSvgController } from "../const/default-svg-controller/default-svg-controller";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { BackgroundDrawingFn } from "../models/options/background-drawing-fn";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
import {
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "../utils/create-background-drawing-fn/create-background-drawing-fn";

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
    let drawingFn: BackgroundDrawingFn = createNoopBackgroundDrawingFn();

    switch (this.apiOptions?.background?.type) {
      case "custom":
        drawingFn = this.apiOptions.background.drawingFn;
        break;

      case "dots":
        drawingFn = createDotsBackgroundDrawingFn(
          this.apiOptions.background.dotColor ?? "#d8d8d8",
          this.apiOptions.background.dotGap ?? 25,
          this.apiOptions.background.dotRadius ?? 1.5,
          this.apiOptions.background.color ?? "#ffffff",
        );
        break;
      case "color":
        drawingFn = createColorBackgroundDrawingFn(
          this.apiOptions.background.color ?? "#ffffff",
        );
        break;
      default:
        break;
    }

    this.options = {
      scale: {
        enabled: this.apiOptions?.scale?.enabled ?? false,
        velocity: this.apiOptions?.scale?.velocity ?? 1.2,
        min: this.apiOptions?.scale?.min ?? null,
        max: this.apiOptions?.scale?.max ?? null,
        trigger: this.apiOptions?.scale?.trigger ?? "wheel",
      },
      background: {
        drawingFn,
      },
      shift: {
        enabled: this.apiOptions?.shift?.enabled ?? false,
      },
      nodes: {
        draggable: this.apiOptions?.nodes?.draggable ?? false,
      },
      connections: {
        svgController:
          this.apiOptions?.connections?.svgController ?? defaultSvgController,
      },
    };

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
    this.di.controller.connectPorts(
      connection.id,
      connection.from,
      connection.to,
      connection.svgController ?? this.options.connections.svgController,
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
