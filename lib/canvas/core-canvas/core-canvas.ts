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
import { GraphStoreController } from "@/graph-store-controller";
import { PublicGraphStore } from "@/public-graph-store";
import { DiContainer } from "./di-container";

/**
 * Provides low level API for acting on graph
 */
export class CoreCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly internalTransformation: ViewportTransformer;

  private readonly graphStoreController: GraphStoreController;

  private readonly htmlController: HtmlController;

  public constructor(di: DiContainer) {
    this.model = di.model;
    this.internalTransformation = di.internalTransformation;
    this.transformation = di.transformation;
    this.htmlController = di.htmlController;
    this.graphStoreController = di.graphStoreController;
  }

  public attach(element: HTMLElement): CoreCanvas {
    this.htmlController.attach(element);

    return this;
  }

  public detach(): CoreCanvas {
    this.htmlController.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): CoreCanvas {
    this.graphStoreController.addNode(request);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): CoreCanvas {
    this.graphStoreController.updateNode(nodeId, request ?? {});

    return this;
  }

  public removeNode(nodeId: unknown): CoreCanvas {
    this.graphStoreController.removeNode(nodeId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): CoreCanvas {
    this.graphStoreController.addEdge(request);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): CoreCanvas {
    this.graphStoreController.updateEdge(edgeId, request ?? {});

    return this;
  }

  public removeEdge(edgeId: unknown): CoreCanvas {
    this.graphStoreController.removeEdge(edgeId);

    return this;
  }

  public markPort(request: MarkPortRequest): CoreCanvas {
    this.graphStoreController.markPort(request);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): CoreCanvas {
    this.graphStoreController.updatePort(portId, request ?? {});

    return this;
  }

  public unmarkPort(portId: string): CoreCanvas {
    this.graphStoreController.unmarkPort(portId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): CoreCanvas {
    this.internalTransformation.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): CoreCanvas {
    this.internalTransformation.patchContentMatrix(request);

    return this;
  }

  public clear(): CoreCanvas {
    this.htmlController.clear();
    this.graphStoreController.clear();

    return this;
  }

  public destroy(): void {
    this.htmlController.destroy();
    this.graphStoreController.clear();
  }
}
