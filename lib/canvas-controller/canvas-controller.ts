import { CenterFn } from "@/center-fn";
import { EdgeController, EdgeControllerFactory, EdgeType } from "@/edges";
import { MarkNodePortRequest } from "@/canvas/canvas";
import { GraphStore } from "@/graph-store";
import { HtmlController } from "@/html-controller";
import { ViewportTransformer } from "@/viewport-transformer";
import { IdGenerator } from "@/id-generator";

export class CanvasController {
  private readonly nodeIdGenerator = new IdGenerator();

  private readonly portIdGenerator = new IdGenerator();

  private readonly edgeIdGenerator = new IdGenerator();

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlController: HtmlController,
    private readonly viewportTransformer: ViewportTransformer,
    private readonly nodesCenterFn: CenterFn,
    private readonly portsCenterFn: CenterFn,
  ) {}

  public moveNodeOnTop(nodeId: string): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to move on top nonexisting node");
    }

    this.htmlController.moveNodeOnTop(nodeId);
  }

  public addNode(
    nodeId: string | undefined,
    element: HTMLElement,
    x: number,
    y: number,
    ports: Record<string, MarkNodePortRequest> | undefined,
    centerFn: CenterFn | undefined,
  ): void {
    if (nodeId === undefined) {
      do {
        nodeId = this.nodeIdGenerator.next();
      } while (this.graphStore.hasNode(nodeId));
    }

    if (this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to add node with existing id");
    }

    this.graphStore.addNode(
      nodeId,
      element,
      x,
      y,
      centerFn ?? this.nodesCenterFn,
    );

    this.htmlController.attachNode(nodeId);

    if (ports !== undefined) {
      Object.entries(ports).forEach(([portId, element]) => {
        if (element instanceof HTMLElement) {
          this.markPort(portId, element, nodeId, this.portsCenterFn, null);
        } else {
          this.markPort(
            portId,
            element.element,
            nodeId,
            element.centerFn ?? this.portsCenterFn,
            element.direction ?? null,
          );
        }
      });
    }
  }

  public markPort(
    portId: string | undefined,
    element: HTMLElement,
    nodeId: string,
    centerFn: CenterFn | undefined,
    dir: number | null | undefined,
  ): void {
    if (portId === undefined) {
      do {
        portId = this.portIdGenerator.next();
      } while (this.graphStore.hasPort(portId));
    }

    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to set port on nonexisting node");
    }

    if (this.graphStore.hasPort(portId)) {
      throw new Error("failed to add port with existing id");
    }

    this.graphStore.addPort(
      portId,
      element,
      nodeId,
      centerFn ?? this.portsCenterFn,
      dir ?? null,
    );
  }

  public updatePortEdge(portId: string): void {
    if (!this.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.htmlController.updatePortEdges(portId);
  }

  public unmarkPort(portId: string): void {
    if (!this.graphStore.hasPort(portId)) {
      throw new Error("failed to unset nonexisting port");
    }

    this.graphStore.getPortAdjacentEdgess(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });

    this.graphStore.removePort(portId);
  }

  public addEdge(
    edgeId: string | undefined,
    fromPortId: string,
    toPortId: string,
    controllerFactory: EdgeControllerFactory,
  ): void {
    if (edgeId === undefined) {
      do {
        edgeId = this.edgeIdGenerator.next();
      } while (this.graphStore.hasEdge(edgeId));
    }
    if (!this.graphStore.hasPort(fromPortId)) {
      throw new Error("failed to add edge from nonexisting port");
    }

    if (!this.graphStore.hasPort(toPortId)) {
      throw new Error("failed to add edge to nonexisting port");
    }

    let edgeType = EdgeType.Regular;

    if (fromPortId === toPortId) {
      edgeType = EdgeType.Cycle;
    }

    this.graphStore.addEdge(
      edgeId,
      fromPortId,
      toPortId,
      controllerFactory(edgeType),
    );

    this.htmlController.attachEdge(edgeId);
  }

  public removeEdge(edgeId: string): void {
    if (!this.graphStore.hasEdge(edgeId)) {
      throw new Error("failed to remove nonexisting edge");
    }

    this.htmlController.detachEdge(edgeId);
    this.graphStore.removeEdge(edgeId);
  }

  public removeNode(nodeId: string): void {
    if (!this.graphStore.hasNode(nodeId)) {
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

  public updateNodeCoordinates(nodeId: string, x: number, y: number): void {
    if (!this.graphStore.hasNode(nodeId)) {
      throw new Error("failed to update coordinates of nonexisting node");
    }

    this.graphStore.updateNodeCoords(nodeId, x, y);
    this.htmlController.updateNodeCoordinates(nodeId);
  }

  public updateEdgeController(
    edgeId: string,
    controller: EdgeController,
  ): void {
    if (!this.graphStore.hasEdge(edgeId)) {
      throw new Error("failed to update nonexisting edge");
    }

    this.htmlController.detachEdge(edgeId);
    this.graphStore.updateEdgeController(edgeId, controller);
    this.htmlController.attachEdge(edgeId);
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
  }

  public destroy(): void {
    this.htmlController.destroy();
  }
}
