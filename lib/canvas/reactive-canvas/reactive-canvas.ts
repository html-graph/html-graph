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
import { ReactiveOptions } from "./reactive-options";

export class ReactiveCanvas implements Canvas {
  public readonly transformation: PublicViewportTransformer;

  public readonly model: PublicGraphStore;

  private readonly nodes = new TwoWayMap<unknown, Element>();

  private readonly ports = new TwoWayMap<unknown, Element>();

  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.nodes.hasKey(nodeId),
  );

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly isNodeResizable: boolean;

  public constructor(
    private readonly canvas: Canvas,
    options?: ReactiveOptions,
  ) {
    this.nodesResizeObserver = new window.ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        this.reactNodeChange(element);
      });
    });

    this.transformation = this.canvas.transformation;
    this.model = this.canvas.model;

    this.isNodeResizable = options?.nodeReactiveStrategy === "resize";
  }

  public addNode(request: AddNodeRequest): ReactiveCanvas {
    const id = this.nodeIdGenerator.create(request.id);

    this.canvas.addNode({
      ...request,
      id,
    });

    this.nodes.set(id, request.element);

    if (this.isNodeResizable) {
      this.nodesResizeObserver.observe(request.element);
    }

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

    if (this.isNodeResizable) {
      this.nodesResizeObserver.unobserve(element!);
      this.nodes.deleteByKey(nodeId);
    }

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
    this.nodes.clear();
    this.ports.clear();

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
