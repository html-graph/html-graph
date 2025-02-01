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

export class ReactiveCanvas implements Canvas {
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
        const element = entry.target;
        const nodeId = this.nodes.getByValue(element)!;

        this.canvas.updateNode(nodeId);

        const edges = this.model.getNodeAdjacentEdgeIds(nodeId);

        edges.forEach((edge) => {
          this.canvas.updateEdge(edge);
        });
      });
    });

    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;
  }

  public addNode(request: AddNodeRequest): ReactiveCanvas {
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
  ): ReactiveCanvas {
    this.canvas.updateNode(nodeId, request);

    return this;
  }

  public removeNode(nodeId: unknown): ReactiveCanvas {
    this.canvas.removeNode(nodeId);

    const element = this.nodes.getByKey(nodeId);

    this.nodes.deleteByKey(nodeId);

    this.nodesResizeObserver.unobserve(element!);

    return this;
  }

  public markPort(port: MarkPortRequest): ReactiveCanvas {
    this.canvas.markPort(port);

    return this;
  }

  public updatePort(
    portId: string,
    request?: UpdatePortRequest,
  ): ReactiveCanvas {
    this.canvas.updatePort(portId, request);

    return this;
  }

  public unmarkPort(portId: string): ReactiveCanvas {
    this.canvas.unmarkPort(portId);

    return this;
  }

  public addEdge(edge: AddEdgeRequest): ReactiveCanvas {
    this.canvas.addEdge(edge);

    return this;
  }

  public updateEdge(
    edgeId: unknown,
    request?: UpdateEdgeRequest,
  ): ReactiveCanvas {
    this.canvas.updateEdge(edgeId, request);

    return this;
  }

  public removeEdge(edgeId: unknown): ReactiveCanvas {
    this.canvas.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): ReactiveCanvas {
    this.canvas.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): ReactiveCanvas {
    this.canvas.patchContentMatrix(request);

    return this;
  }

  public clear(): ReactiveCanvas {
    this.canvas.clear();

    return this;
  }

  public attach(element: HTMLElement): ReactiveCanvas {
    this.canvas.attach(element);

    return this;
  }

  public detach(): ReactiveCanvas {
    this.canvas.detach();

    return this;
  }

  public destroy(): void {
    this.canvas.destroy();
  }
}
