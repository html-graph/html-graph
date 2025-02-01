import { PublicViewportTransformer } from "@/viewport-transformer";
import {
  AddEdgeRequest,
  AddNodeRequest,
  MarkPortRequest,
  PatchMatrixRequest,
  Canvas,
  UpdateEdgeRequest,
  UpdateNodeRequest,
} from "../canvas";
import { UpdatePortRequest } from "../canvas/update-port-request";
import { IdGenerator } from "@/id-generator";
import { TwoWayMap } from "./two-way-map";
import { PublicGraphStore } from "@/graph-store";

export class ResizableNodesCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly nodes = new TwoWayMap<unknown, Element>();

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.hasKey(nodeId),
  );

  private readonly nodesResizeObserver: ResizeObserver;

  public constructor(private readonly canvas: Canvas) {
    this.nodesResizeObserver = new window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        this.reactNodeChange(element);
      });
    });

    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;
  }

  public addNode(request: AddNodeRequest): ResizableNodesCanvas {
    const id = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({
      ...request,
      id,
    });

    this.nodes.set(id, request.element);
    this.nodesResizeObserver.observe(request.element);

    return this;
  }

  public updateNode(
    nodeId: unknown,
    request?: UpdateNodeRequest,
  ): ResizableNodesCanvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): ResizableNodesCanvas {
    this.canvas.removeNode(nodeId);

    const element = this.nodes.getByKey(nodeId);

    this.nodes.deleteByKey(nodeId);

    this.nodesResizeObserver.unobserve(element!);
    this.nodes.deleteByKey(nodeId);

    return this;
  }

  public markPort(port: MarkPortRequest): ResizableNodesCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): ResizableNodesCanvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): ResizableNodesCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): ResizableNodesCanvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): ResizableNodesCanvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): ResizableNodesCanvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(
    request: PatchMatrixRequest,
  ): ResizableNodesCanvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): ResizableNodesCanvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): ResizableNodesCanvas {
    this.canvas.clear();
    this.nodes.clear();

    return this;
  }

  public attach(element: HTMLElement): ResizableNodesCanvas {
    this.canvas.attach(element);

    return this;
  }

  public detach(): ResizableNodesCanvas {
    this.canvas.detach();

    return this;
  }

  public destroy(): void {
    this.canvas.destroy();

    if (this.nodesResizeObserver !== null) {
      this.nodesResizeObserver.disconnect();
    }
  }

  private reactNodeChange(element: HTMLElement): void {
    const nodeId = this.nodes.getByValue(element)!;

    this.canvas.updateNode(nodeId);

    const edges = this.model.getNodeAdjacentEdgeIds(nodeId);

    edges.forEach((edge) => {
      this.canvas.updateEdge(edge);
    });
  }
}
