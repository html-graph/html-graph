import { AddNodeRequest } from "../add-node-request";
import { UpdateNodeRequest } from "../update-node-request";
import { AddEdgeRequest } from "../add-edge-request";
import { UpdateEdgeRequest } from "../update-edge-request";
import { MarkPortRequest } from "../mark-port-request";
import { UpdatePortRequest } from "../update-port-request";
import { PatchMatrixRequest } from "../patch-matrix-request";
import { Graph } from "@/graph";
import { Viewport } from "@/viewport-transformer";
import { Canvas } from "../canvas";
import { EventSubject } from "@/event-subject";
import { RenderingBox } from "@/html-view";
import { VirtualScrollOptions } from "./virtual-scroll-options";

export class TransformVirtualScrollCanvas implements Canvas {
  public readonly graph: Graph;

  public readonly model: Graph;

  public readonly viewport: Viewport;

  public readonly transformation: Viewport;

  public constructor(
    private readonly canvas: Canvas,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly options: VirtualScrollOptions,
  ) {
    console.log(this.trigger, this.options);
    this.viewport = this.canvas.viewport;
    this.transformation = this.viewport;
    this.graph = this.canvas.graph;
    this.model = this.graph;
  }

  public attach(element: HTMLElement): Canvas {
    this.canvas.attach(element);

    return this;
  }

  public detach(): Canvas {
    this.canvas.detach();

    return this;
  }

  public addNode(node: AddNodeRequest): Canvas {
    this.canvas.addNode(node);

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): Canvas {
    this.canvas.removeNode(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): Canvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(portId: string, request?: UpdatePortRequest): Canvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): Canvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): Canvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): Canvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): Canvas {
    this.canvas.clear();

    return this;
  }

  public destroy(): void {
    this.canvas.destroy();
  }
}
