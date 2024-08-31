import { DiContainer } from "../components/di-container/di-container";
import { defaultSvgController } from "../const/default-svg-controller/default-svg-controller";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
import {
  createColorBackgroundDrawingFn,
  createDotsBackgroundDrawingFn,
  createNoopBackgroundDrawingFn,
} from "../utils/create-background-drawing-fn/create-background-drawing-fn";

export class Canvas {
  private readonly options: Options;

  private readonly di: DiContainer;

  constructor(
    private readonly canvasWrapper: HTMLElement,
    private readonly apiOptions?: ApiOptions,
  ) {
    let drawingFn = createNoopBackgroundDrawingFn();

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

  addNode(node: ApiNode): Canvas {
    this.di.controller.addNode(node.id, node.element, node.x, node.y);

    return this;
  }

  removeNode(nodeId: string): Canvas {
    this.di.controller.removeNode(nodeId);

    return this;
  }

  markPort(port: ApiPort): Canvas {
    this.di.controller.markPort(port.id, port.element, port.nodeId);

    return this;
  }

  unmarkPort(portId: string): Canvas {
    this.di.controller.unmarkPort(portId);

    return this;
  }

  connectPorts(connection: ApiConnection): Canvas {
    this.di.controller.connectPorts(
      connection.id,
      connection.from,
      connection.to,
      connection.svgController ?? this.options.connections.svgController,
    );

    return this;
  }

  removeConnection(connectionId: string): Canvas {
    this.di.controller.removeConnection(connectionId);

    return this;
  }

  clear(): Canvas {
    this.di.controller.clear();

    return this;
  }

  destroy(): void {
    this.di.controller.destroy();
  }
}
