import { DiContainer } from "../components/di-container/di-container";
import { ApiConnection } from "../models/connection/api-connection";
import { ApiUpdateConnection } from "../models/connection/api-update-connection";
import { ApiNode } from "../models/nodes/api-node";
import { ApiOptions } from "../models/options/api-options";
import { Options } from "../models/options/options";
import { ApiPort } from "../models/port/api-port";
import { ApiContentMoveTransform } from "../models/transform/api-content-move-transform";
import { ApiContentScaleTransform } from "../models/transform/api-content-scale-transform";
import { ApiTransform } from "../models/transform/api-transform";
import { createOptions } from "../utils/create-options/create-options";
import { Canvas } from "./canvas";

/**
 * Provides core API for acting on graph
 */
export class CanvasCore implements Canvas<CanvasCore> {
  private readonly options: Options;

  private readonly di: DiContainer;

  constructor(private readonly apiOptions?: ApiOptions) {
    this.options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer(this.options);
  }

  addNode(node: ApiNode): CanvasCore {
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

  moveNodeOnTop(nodeId: string): CanvasCore {
    this.di.controller.moveNodeOnTop(nodeId);

    return this;
  }

  removeNode(nodeId: string): CanvasCore {
    this.di.controller.removeNode(nodeId);

    return this;
  }

  markPort(port: ApiPort): CanvasCore {
    this.di.controller.markPort(
      port.id,
      port.element,
      port.nodeId,
      port.centerFn,
      port.direction,
    );

    return this;
  }

  updatePortConnections(portId: string): CanvasCore {
    this.di.controller.updatePortConnections(portId);

    return this;
  }

  unmarkPort(portId: string): CanvasCore {
    this.di.controller.unmarkPort(portId);

    return this;
  }

  addConnection(connection: ApiConnection): CanvasCore {
    this.di.controller.addConnection(
      connection.id,
      connection.from,
      connection.to,
      connection.options,
    );

    return this;
  }

  removeConnection(connectionId: string): CanvasCore {
    this.di.controller.removeConnection(connectionId);

    return this;
  }

  patchViewportTransform(apiTransform: ApiTransform): CanvasCore {
    this.di.controller.patchViewportTransform(
      apiTransform.scale ?? null,
      apiTransform.x ?? null,
      apiTransform.y ?? null,
    );

    return this;
  }

  moveContent(apiTransform: ApiContentMoveTransform): CanvasCore {
    this.di.controller.moveContent(apiTransform.x ?? 0, apiTransform.y ?? 0);

    return this;
  }

  scaleContent(apiTransform: ApiContentScaleTransform): CanvasCore {
    this.di.controller.scaleContent(
      apiTransform.scale ?? 1,
      apiTransform.x ?? 0,
      apiTransform.y ?? 0,
    );

    return this;
  }

  moveToNodes(nodeIds: readonly string[]): CanvasCore {
    this.di.controller.moveToNodes(nodeIds);

    return this;
  }

  updateNodeCoords(nodeId: string, x: number, y: number): CanvasCore {
    this.di.controller.updateNodeCoords(nodeId, x, y);

    return this;
  }

  updateConnectionOptions(
    connectionId: string,
    options: ApiUpdateConnection,
  ): CanvasCore {
    if (options.controller !== undefined) {
      this.di.controller.updateConnectionController(
        connectionId,
        options.controller,
      );
    }

    return this;
  }

  dragNode(nodeId: string, dx: number, dy: number): CanvasCore {
    this.di.controller.dragNode(nodeId, dx, dy);

    return this;
  }

  setCursor(cursor: string | null): CanvasCore {
    this.di.htmlController.setCursor(cursor);

    return this;
  }

  clear(): CanvasCore {
    this.di.controller.clear();

    return this;
  }

  attach(element: HTMLElement): CanvasCore {
    this.di.htmlController.attach(element);

    return this;
  }

  detach(): CanvasCore {
    this.di.htmlController.detach();

    return this;
  }

  destroy(): void {
    this.di.controller.destroy();
  }
}
