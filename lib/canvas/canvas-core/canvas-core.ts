import { CoreOptions, createOptions } from "./options";
import { GraphStore } from "@/graph-store";
import {
  PublicViewportTransformer,
  ViewportTransformer,
} from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { HtmlController } from "@/html-controller";
import { CanvasController, Options } from "@/canvas-controller";
import { PublicGraphStore } from "@/public-graph-store";

/**
 * Provides low level API for acting on graph
 */
export class CanvasCore implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly canvasController: CanvasController;

  private readonly htmlController: HtmlController;

  public constructor(private readonly apiOptions?: CoreOptions) {
    const options: Options = createOptions(this.apiOptions);

    const viewportTransformer = new ViewportTransformer();
    const graphStore = new GraphStore();

    this.model = new PublicGraphStore(graphStore);
    this.transformation = new PublicViewportTransformer(viewportTransformer);

    this.htmlController = new HtmlController(graphStore, viewportTransformer);

    this.canvasController = new CanvasController(
      graphStore,
      this.htmlController,
      viewportTransformer,
      options,
    );
  }

  public attach(element: HTMLElement): CanvasCore {
    this.canvasController.attach(element);

    return this;
  }

  public detach(): CanvasCore {
    this.canvasController.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CanvasCore {
    this.canvasController.addNode(request);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): CanvasCore {
    this.canvasController.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): CanvasCore {
    this.canvasController.removeNode(nodeId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): CanvasCore {
    this.canvasController.addEdge(request);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): CanvasCore {
    this.canvasController.updateEdge(edgeId, request ?? {});

    return this;
  }

  public removeEdge(edgeId: unknown): CanvasCore {
    this.canvasController.removeEdge(edgeId);

    return this;
  }

  public markPort(request: MarkPortRequest): CanvasCore {
    this.canvasController.markPort(request);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): CanvasCore {
    this.canvasController.updatePort(portId, request ?? {});

    return this;
  }

  public unmarkPort(portId: string): CanvasCore {
    this.canvasController.unmarkPort(portId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CanvasCore {
    this.canvasController.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CanvasCore {
    this.canvasController.patchContentMatrix(request);

    return this;
  }

  public clear(): CanvasCore {
    this.canvasController.clear();

    return this;
  }

  public destroy(): void {
    this.canvasController.destroy();
  }
}
