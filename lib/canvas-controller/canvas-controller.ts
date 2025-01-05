import { CenterFn } from "@/center-fn";
import { EdgeControllerFactory, EdgeType } from "@/edges";
import { MarkNodePortRequest, UpdateEdgeRequest } from "@/canvas/canvas";
import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";
import { PriorityGenerator } from "@/priority-generator";
import { UpdatePortRequest } from "@/canvas/canvas/update-port-request";

export class CanvasController {
  private readonly nodeIdGenerator = new IdGenerator();

  private readonly portIdGenerator = new IdGenerator();

  private readonly edgeIdGenerator = new IdGenerator();

  private readonly priorityGenerator = new PriorityGenerator();

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlController: HtmlController,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly nodesCenterFn: CenterFn,
    private readonly portsCenterFn: CenterFn,
    private readonly portsDirection: number,
  ) {}

  public moveNodeOnTop(nodeId: string): void {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new Error("failed to move on top nonexisting node");
    }

    const newEdgesPriority = this.priorityGenerator.create();
    const newNodePriority = this.priorityGenerator.create();

    node.priority = newNodePriority;
    this.htmlController.updateNodePriority(nodeId);

    const edges = this.graphStore.getNodeAdjacentEdges(nodeId);

    edges.forEach((edgeId) => {
      const edge = this.graphStore.getEdge(edgeId)!;
      edge.priority = newEdgesPriority;

      this.htmlController.updateEdgePriority(edgeId);
    });
  }

  public addNode(
    nodeId: string | undefined,
    element: HTMLElement,
    x: number,
    y: number,
    ports: Record<string, MarkNodePortRequest> | undefined,
    centerFn: CenterFn | undefined,
    priority: number | undefined,
  ): void {
    if (nodeId === undefined) {
      do {
        nodeId = this.nodeIdGenerator.create();
      } while (this.graphStore.getNode(nodeId) !== undefined);
    }

    if (this.graphStore.getNode(nodeId) !== undefined) {
      throw new Error("failed to add node with existing id");
    }

    if (priority !== undefined) {
      this.priorityGenerator.push(priority);
    }

    this.graphStore.addNode(
      nodeId,
      element,
      x,
      y,
      centerFn ?? this.nodesCenterFn,
      priority ?? this.priorityGenerator.create(),
    );

    this.htmlController.attachNode(nodeId);

    if (ports !== undefined) {
      Object.entries(ports).forEach(([portId, element]) => {
        if (element instanceof HTMLElement) {
          this.markPort(
            portId,
            element,
            nodeId,
            this.portsCenterFn,
            this.portsDirection,
          );
        } else {
          this.markPort(
            portId,
            element.element,
            nodeId,
            element.centerFn ?? this.portsCenterFn,
            element.direction ?? this.portsDirection,
          );
        }
      });
    }
  }

  public updateNode(
    nodeId: string,
    x: number | undefined,
    y: number | undefined,
    priority: number | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    const node = this.graphStore.getNode(nodeId);

    if (node === undefined) {
      throw new Error("failed to update nonexisting node");
    }

    node.x = x ?? node.x;
    node.y = y ?? node.y;
    node.centerFn = centerFn ?? node.centerFn;

    this.htmlController.updateNodeCoordinates(nodeId);

    if (priority !== undefined) {
      node.priority = priority;

      this.htmlController.updateNodePriority(nodeId);
    }
  }

  public markPort(
    portId: string | undefined,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn | undefined,
    dir: number | undefined,
  ): void {
    if (portId === undefined) {
      do {
        portId = this.portIdGenerator.create();
      } while (this.graphStore.getPort(portId) !== undefined);
    }

    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new Error("failed to set port on nonexisting node");
    }

    if (this.graphStore.getPort(portId) !== undefined) {
      throw new Error("failed to add port with existing id");
    }

    this.graphStore.addPort(
      portId,
      element,
      nodeId,
      centerFn ?? this.portsCenterFn,
      dir ?? 0,
    );
  }

  public updatePort(
    portId: string,
    request: UpdatePortRequest | undefined,
  ): void {
    const port = this.graphStore.getPort(portId);

    if (port === undefined) {
      throw new Error("failed to unset nonexisting port");
    }

    port.direction = request?.direction ?? port.direction;
    port.centerFn = request?.centerFn ?? port.centerFn;

    this.htmlController.updatePortEdges(portId);
  }

  public unmarkPort(portId: string): void {
    if (this.graphStore.getPort(portId) === undefined) {
      throw new Error("failed to unset nonexisting port");
    }

    this.graphStore.getPortAdjacentEdges(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.graphStore.removePort(portId);
  }

  public addEdge(
    edgeId: string | undefined,
    fromPortId: string,
    toPortId: string,
    controllerFactory: EdgeControllerFactory,
    priority: number | undefined,
  ): void {
    if (edgeId === undefined) {
      do {
        edgeId = this.edgeIdGenerator.create();
      } while (this.graphStore.getEdge(edgeId) !== undefined);
    }

    if (this.graphStore.getPort(fromPortId) === undefined) {
      throw new Error("failed to add edge from nonexisting port");
    }

    if (this.graphStore.getPort(toPortId) === undefined) {
      throw new Error("failed to add edge to nonexisting port");
    }

    if (this.graphStore.getEdge(edgeId) !== undefined) {
      throw new Error("failed to add edge with existing id");
    }

    let edgeType = EdgeType.Regular;

    const fromNodeId = this.graphStore.getPortNode(fromPortId);
    const toNodeId = this.graphStore.getPortNode(toPortId);

    if (fromPortId === toPortId) {
      edgeType = EdgeType.PortCycle;
    } else if (fromNodeId === toNodeId) {
      edgeType = EdgeType.NodeCycle;
    }

    if (priority !== undefined) {
      this.priorityGenerator.push(priority);
    }

    this.graphStore.addEdge(
      edgeId,
      fromPortId,
      toPortId,
      controllerFactory(edgeType),
      priority ?? this.priorityGenerator.create(),
    );

    this.htmlController.attachEdge(edgeId);
  }

  public updateEdge(edgeId: string, request: UpdateEdgeRequest): void {
    const edge = this.graphStore.getEdge(edgeId);
    if (edge === undefined) {
      throw new Error("failed to update nonexisting edge");
    }

    if (request.controller !== undefined) {
      this.htmlController.detachEdge(edgeId);
      edge.controller = request.controller;
      this.htmlController.attachEdge(edgeId);
    }

    if (request.priority !== undefined) {
      edge.priority = request.priority;
      this.htmlController.updateEdgePriority(edgeId);
    }
  }

  public removeEdge(edgeId: string): void {
    if (this.graphStore.getEdge(edgeId) === undefined) {
      throw new Error("failed to remove nonexisting edge");
    }

    this.htmlController.detachEdge(edgeId);
    this.graphStore.removeEdge(edgeId);
  }

  public removeNode(nodeId: string): void {
    if (this.graphStore.getNode(nodeId) === undefined) {
      throw new Error("failed to remove nonexisting node");
    }

    this.htmlController.detachNode(nodeId);
    this.graphStore.removeNode(nodeId);
  }

  public patchViewportState(
    scale: number | null,
    x: number | null,
    y: number | null,
  ): void {
    this.viewportTransformer.patchState(scale, x, y);
    this.htmlController.applyTransform();
  }

  public moveToNodes(nodeIds: readonly string[]): void {
    if (nodeIds.length === 0) {
      return;
    }

    const nodes = nodeIds
      .map((nodeId) => this.graphStore.getNode(nodeId))
      .filter((node) => node !== undefined);

    if (nodes.length < nodeIds.length) {
      throw new Error("failed to move to nonexisting node");
    }

    const [x, y] = nodes.reduce(
      (acc, cur) => [acc[0] + cur.x, acc[1] + cur.y],
      [0, 0],
    );

    const avgX = x / nodes.length;
    const avgY = y / nodes.length;
    const [width, height] = this.htmlController.getViewportDimensions();
    const sa = this.viewportTransformer.getAbsScale();

    const targetX = avgX - (sa * width) / 2;
    const targetY = avgY - (sa * height) / 2;

    this.patchViewportState(null, targetX, targetY);
  }

  public attach(element: HTMLElement): void {
    this.htmlController.attach(element);
  }

  public detach(): void {
    this.htmlController.detach();
  }

  public clear(): void {
    this.htmlController.clear();
    this.graphStore.clear();
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();
    this.priorityGenerator.reset();
  }

  public destroy(): void {
    this.htmlController.destroy();
  }
}
