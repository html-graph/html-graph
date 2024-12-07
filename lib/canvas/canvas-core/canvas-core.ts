import { DiContainer } from "@/di-container";
import {
  AddConnectionRequest,
  AddNodeRequest,
  ApiContentMoveTransform,
  ApiContentScaleTransform,
  ApiPort,
  ApiTransform,
  Canvas,
} from "..";
import { PublicGraphStore } from "@/graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveConnectionControllerFactory } from "./resolve-connection-controller-factory";
import { ConnectionController } from "@/connections";

/**
 * Provides core API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly options: Options;

  private readonly di: DiContainer;

  public constructor(private readonly apiOptions?: CoreOptions) {
    this.options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer(this.options);

    this.transformation = this.di.publicViewportTransformer;

    this.model = this.di.publicGraphStore;
  }

  public addNode(node: AddNodeRequest): CanvasCore {
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

  public moveNodeOnTop(nodeId: string): CanvasCore {
    this.di.controller.moveNodeOnTop(nodeId);

    return this;
  }

  public removeNode(nodeId: string): CanvasCore {
    this.di.controller.removeNode(nodeId);

    return this;
  }

  public markPort(port: ApiPort): CanvasCore {
    this.di.controller.markPort(
      port.id,
      port.element,
      port.nodeId,
      port.centerFn,
      port.direction,
    );

    return this;
  }

  public updatePortConnections(portId: string): CanvasCore {
    this.di.controller.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.di.controller.unmarkPort(portId);

    return this;
  }

  public addConnection(connection: AddConnectionRequest): CanvasCore {
    const controllerFactory =
      connection.options !== undefined
        ? resolveConnectionControllerFactory(connection.options)
        : this.di.options.connections.controllerFactory;

    this.di.controller.addConnection(
      connection.id,
      connection.from,
      connection.to,
      controllerFactory,
    );

    return this;
  }

  public removeConnection(connectionId: string): CanvasCore {
    this.di.controller.removeConnection(connectionId);

    return this;
  }

  public patchViewportTransform(apiTransform: ApiTransform): CanvasCore {
    this.di.controller.patchViewportTransform(
      apiTransform.scale ?? null,
      apiTransform.x ?? null,
      apiTransform.y ?? null,
    );

    return this;
  }

  public moveContent(apiTransform: ApiContentMoveTransform): CanvasCore {
    this.di.controller.moveContent(apiTransform.x ?? 0, apiTransform.y ?? 0);

    return this;
  }

  public scaleContent(apiTransform: ApiContentScaleTransform): CanvasCore {
    this.di.controller.scaleContent(
      apiTransform.scale,
      apiTransform.x ?? 0,
      apiTransform.y ?? 0,
    );

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): CanvasCore {
    this.di.controller.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoords(nodeId: string, x: number, y: number): CanvasCore {
    this.di.controller.updateNodeCoords(nodeId, x, y);

    return this;
  }

  public updateConnectionController(
    connectionId: string,
    controller: ConnectionController,
  ): CanvasCore {
    this.di.controller.updateConnectionOptions(connectionId, controller);

    return this;
  }

  public dragNode(nodeId: string, dx: number, dy: number): CanvasCore {
    this.di.controller.dragNode(nodeId, dx, dy);

    return this;
  }

  public clear(): CanvasCore {
    this.di.controller.clear();

    return this;
  }

  public attach(element: HTMLElement): CanvasCore {
    this.di.htmlController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.di.htmlController.detach();

    return this;
  }

  public destroy(): void {
    this.di.controller.destroy();
  }
}
