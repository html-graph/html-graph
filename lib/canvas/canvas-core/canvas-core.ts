import { DiContainer } from "@/di-container";
import {
  AddConnectionRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchViewportRequest,
  Canvas,
  UpdateConnectionRequest,
} from "../canvas";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Options } from "./options";
import { CoreOptions } from "./core-options";
import { createOptions } from "./create-options";
import { resolveConnectionControllerFactory } from "./resolve-connection-controller-factory";
import { ConnectionControllerFactory } from "@/connections";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  private readonly di: DiContainer;

  private readonly connectionControllerFactory: ConnectionControllerFactory;

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: Options = createOptions(this.apiOptions ?? {});

    this.di = new DiContainer(
      options.layers.mode,
      options.background.drawingFn,
      options.nodes.centerFn,
      options.ports.centerFn,
    );

    this.transformation = this.di.publicViewportTransformer;

    this.connectionControllerFactory = options.connections.controllerFactory;
  }

  public addNode(node: AddNodeRequest): CanvasCore {
    this.di.canvasController.addNode(
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
    this.di.canvasController.moveNodeOnTop(nodeId);

    return this;
  }

  public removeNode(nodeId: string): CanvasCore {
    this.di.canvasController.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): CanvasCore {
    this.di.canvasController.markPort(
      port.id,
      port.element,
      port.nodeId,
      port.centerFn,
      port.direction,
    );

    return this;
  }

  public updatePortConnections(portId: string): CanvasCore {
    this.di.canvasController.updatePortConnections(portId);

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.di.canvasController.unmarkPort(portId);

    return this;
  }

  public addConnection(connection: AddConnectionRequest): CanvasCore {
    const controllerFactory =
      connection.options !== undefined
        ? resolveConnectionControllerFactory(connection.options)
        : this.connectionControllerFactory;

    this.di.canvasController.addConnection(
      connection.id,
      connection.from,
      connection.to,
      controllerFactory,
    );

    return this;
  }

  public removeConnection(connectionId: string): CanvasCore {
    this.di.canvasController.removeConnection(connectionId);

    return this;
  }

  public patchViewportState(request: PatchViewportRequest): CanvasCore {
    this.di.canvasController.patchViewportState(
      request.scale ?? null,
      request.x ?? null,
      request.y ?? null,
    );

    return this;
  }

  public moveToNodes(nodeIds: readonly string[]): CanvasCore {
    this.di.canvasController.moveToNodes(nodeIds);

    return this;
  }

  public updateNodeCoordinates(
    nodeId: string,
    x: number,
    y: number,
  ): CanvasCore {
    this.di.canvasController.updateNodeCoordinates(nodeId, x, y);

    return this;
  }

  public updateConnection(
    connectionId: string,
    request: UpdateConnectionRequest,
  ): CanvasCore {
    if (request.controller !== undefined) {
      this.di.canvasController.updateConnectionController(
        connectionId,
        request.controller,
      );
    }

    return this;
  }

  public clear(): CanvasCore {
    this.di.canvasController.clear();

    return this;
  }

  public attach(element: HTMLElement): CanvasCore {
    this.di.canvasController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.di.canvasController.detach();

    return this;
  }

  public destroy(): void {
    this.di.canvasController.destroy();
  }
}
