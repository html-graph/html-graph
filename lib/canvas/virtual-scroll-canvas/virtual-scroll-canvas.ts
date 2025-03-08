import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { PublicGraphStore } from "@/public-graph-store";
import { PublicViewportTransformer } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { RenderingBox } from "./rendering-box";
import { EventSubject } from "@/event-subject";

export class VirtualScrollCanvas implements Canvas {
  public readonly model: PublicGraphStore;

  public readonly transformation: PublicViewportTransformer;

  private triggerCallback = (payload: RenderingBox): void => {
    console.log(payload);
  };

  public constructor(
    private readonly canvas: Canvas,
    private readonly trigger: EventSubject<RenderingBox>,
  ) {
    this.trigger.subscribe(this.triggerCallback);
    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;
  }

  public attach(element: HTMLElement): VirtualScrollCanvas {
    this.canvas.attach(element);

    return this;
  }

  public detach(): VirtualScrollCanvas {
    this.canvas.detach();

    return this;
  }

  public addNode(node: AddNodeRequest): VirtualScrollCanvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): VirtualScrollCanvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): VirtualScrollCanvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): VirtualScrollCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): VirtualScrollCanvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): VirtualScrollCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): VirtualScrollCanvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): VirtualScrollCanvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): VirtualScrollCanvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): VirtualScrollCanvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): VirtualScrollCanvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): VirtualScrollCanvas {
    this.canvas.clear();

    return this;
  }

  public destroy(): void {
    this.trigger.unsubscribe(this.triggerCallback);
    this.canvas.destroy();
  }
}
