import { Viewport } from "@/viewport-transformer";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { PatchMatrixRequest } from "./patch-matrix-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { Graph } from "@/graph";
import { CanvasController } from "@/canvas-controller";
import { IdGenerator } from "@/id-generator";
import { HtmlGraphError } from "@/error";
import { GraphDefaults } from "./graph-defaults";

export class Canvas {
  private readonly nodeIdGenerator = new IdGenerator(
    (nodeId) => this.graph.getNode(nodeId) !== null,
  );

  private readonly portIdGenerator = new IdGenerator(
    (portId) => this.graph.getPort(portId) !== null,
  );

  private readonly edgeIdGenerator = new IdGenerator(
    (edgeId) => this.graph.getEdge(edgeId) !== null,
  );

  public readonly graph: Graph;

  public readonly viewport: Viewport;

  public constructor(
    private readonly controller: CanvasController,
    private readonly defaults: GraphDefaults,
  ) {
    this.graph = controller.graph;
    this.viewport = controller.viewport;
  }

  public attach(element: HTMLElement): Canvas {
    this.controller.attach(element);

    return this;
  }

  public detach(): Canvas {
    this.controller.detach();

    return this;
  }

  public addNode(request: AddNodeRequest): Canvas {
    const id = this.nodeIdGenerator.create(request.id);

    if (this.graph.getNode(id) !== null) {
      throw new HtmlGraphError("failed to add node with existing id");
    }

    this.controller.addNode({
      id,
      element: request.element,
      x: request.x,
      y: request.y,
      centerFn: request.centerFn ?? this.defaults.nodes.centerFn,
      priority: request.priority ?? this.defaults.nodes.priorityFn(),
    });

    Array.from(request.ports ?? []).forEach((port) => {
      this.markPort({
        id: port.id,
        element: port.element,
        nodeId: id,
        direction: port.direction,
      });
    });

    return this;
  }

  public updateNode(nodeId: unknown, request?: UpdateNodeRequest): Canvas {
    const node = this.graph.getNode(nodeId);

    if (node === null) {
      throw new HtmlGraphError("failed to update nonexisting node");
    }

    this.controller.updateNode(nodeId, request ?? {});

    return this;
  }

  public removeNode(nodeId: unknown): Canvas {
    if (this.graph.getNode(nodeId) === undefined) {
      throw new HtmlGraphError("failed to remove nonexisting node");
    }

    this.controller.removeNode(nodeId);

    return this;
  }

  public markPort(request: MarkPortRequest): Canvas {
    const id = this.portIdGenerator.create(request.id);

    if (this.graph.getPort(id) !== null) {
      throw new HtmlGraphError("failed to add port with existing id");
    }

    if (this.graph.getNode(request.nodeId) === null) {
      throw new HtmlGraphError("failed to set port on nonexisting node");
    }

    this.controller.markPort({
      id,
      element: request.element,
      nodeId: request.nodeId,
      direction: request.direction ?? this.defaults.ports.direction,
    });

    return this;
  }

  public updatePort(portId: unknown, request?: UpdatePortRequest): Canvas {
    const port = this.graph.getPort(portId);

    if (port === null) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    this.controller.updatePort(portId, request ?? {});

    return this;
  }

  public unmarkPort(portId: unknown): Canvas {
    if (this.graph.getPort(portId) === null) {
      throw new HtmlGraphError("failed to unset nonexisting port");
    }

    this.controller.unmarkPort(portId);

    return this;
  }

  public addEdge(request: AddEdgeRequest): Canvas {
    const id = this.edgeIdGenerator.create(request.id);

    if (this.graph.getEdge(id) !== null) {
      throw new HtmlGraphError("failed to add edge with existing id");
    }

    if (this.graph.getPort(request.from) === null) {
      throw new HtmlGraphError("failed to add edge from nonexisting port");
    }

    if (this.graph.getPort(request.to) === null) {
      throw new HtmlGraphError("failed to add edge to nonexisting port");
    }

    this.controller.addEdge({
      id,
      from: request.from,
      to: request.to,
      shape: request.shape ?? this.defaults.edges.shapeFactory(),
      priority: request.priority ?? this.defaults.edges.priorityFn(),
    });

    return this;
  }

  public updateEdge(edgeId: unknown, request?: UpdateEdgeRequest): Canvas {
    const edge = this.graph.getEdge(edgeId);

    if (edge === null) {
      throw new HtmlGraphError("failed to update nonexisting edge");
    }

    this.controller.updateEdge(edgeId, request ?? {});

    return this;
  }

  public removeEdge(edgeId: unknown): Canvas {
    if (this.graph.getEdge(edgeId) === null) {
      throw new HtmlGraphError("failed to remove nonexisting edge");
    }

    this.controller.removeEdge(edgeId);

    return this;
  }

  public patchViewportMatrix(request: PatchMatrixRequest): Canvas {
    this.controller.patchViewportMatrix(request);

    return this;
  }

  public patchContentMatrix(request: PatchMatrixRequest): Canvas {
    this.controller.patchContentMatrix(request);

    return this;
  }

  public clear(): Canvas {
    this.controller.clear();

    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();

    return this;
  }

  public destroy(): void {
    this.controller.destroy();
  }
}
