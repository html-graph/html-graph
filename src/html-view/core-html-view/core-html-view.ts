import { Point } from "@/point";
import { GraphStore, StorePort } from "@/graph-store";
import { TransformState, ViewportStore } from "@/viewport-store";
import { EdgeRenderPort } from "@/edges";
import { HtmlView } from "../html-view";
import { transformPoint } from "@/transform-point";
import { ConnectionCategory } from "@/edges/connection-category";
import { createHost } from "./create-host";
import { createContainer } from "./create-container";
import { prepareNodeElement } from "./prepare-node-element";

/**
 * This entity is responsible for HTML modifications
 */
export class CoreHtmlView implements HtmlView {
  private readonly host = createHost();

  private readonly container = createContainer();

  private readonly edgeIdToElementMap = new Map<unknown, SVGSVGElement>();

  private readonly applyTransform = (): void => {
    const m = this.viewportStore.getContentMatrix();

    this.container.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.x}, ${m.y})`;
  };

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly viewportStore: ViewportStore,
    private readonly element: HTMLElement,
  ) {
    this.element.appendChild(this.host);
    this.host.appendChild(this.container);

    this.viewportStore.onAfterUpdated.subscribe(this.applyTransform);
  }

  public attachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;

    prepareNodeElement(node.element);

    this.container.appendChild(node.element);

    this.updateNodePosition(nodeId);
    this.updateNodePriority(nodeId);

    node.element.style.visibility = "visible";
  }

  public detachNode(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;

    this.container.removeChild(node.element);
  }

  public attachEdge(edgeId: unknown): void {
    const svg = this.graphStore.getEdge(edgeId)!.payload.shape.svg;

    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);

    this.renderEdge(edgeId);
    this.updateEdgePriority(edgeId);
  }

  public detachEdge(edgeId: unknown): void {
    const svg = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(svg);
    this.edgeIdToElementMap.delete(edgeId);
  }

  public clear(): void {
    this.edgeIdToElementMap.forEach((_element, edgeId) => {
      this.detachEdge(edgeId);
    });

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      this.detachNode(nodeId);
    });
  }

  public destroy(): void {
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform);

    this.clear();

    this.element.removeChild(this.host);
    this.host.removeChild(this.container);
  }

  public updateNodePosition(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;
    const { width, height } = node.element.getBoundingClientRect();
    const viewportScale = this.viewportStore.getViewportMatrix().scale;
    const center = node.payload.centerFn(width, height);

    const x = node.payload.x - viewportScale * center.x;
    const y = node.payload.y - viewportScale * center.y;

    node.element.style.transform = `translate(${x}px, ${y}px)`;
  }

  public updateNodePriority(nodeId: unknown): void {
    const node = this.graphStore.getNode(nodeId)!;

    node.element.style.zIndex = `${node.payload.priority}`;
  }

  public updateEdgeShape(edgeId: unknown): void {
    const element = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(element);

    const edge = this.graphStore.getEdge(edgeId)!;

    const svg = edge.payload.shape.svg;

    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);
  }

  public renderEdge(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const portFrom = this.graphStore.getPort(edge.from)!;
    const portTo = this.graphStore.getPort(edge.to)!;

    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
    const rectCanvas = this.host.getBoundingClientRect();
    const viewportMatrix = this.viewportStore.getViewportMatrix();

    const from = this.createEdgeRenderPort(
      portFrom,
      rectFrom,
      rectCanvas,
      viewportMatrix,
    );

    const to = this.createEdgeRenderPort(
      portTo,
      rectTo,
      rectCanvas,
      viewportMatrix,
    );

    let category = ConnectionCategory.Line;

    if (portFrom.element === portTo.element) {
      category = ConnectionCategory.PortCycle;
    } else if (portFrom.nodeId === portTo.nodeId) {
      category = ConnectionCategory.NodeCycle;
    }

    edge.payload.shape.render({ from, to, category });
  }

  public updateEdgePriority(edgeId: unknown): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.payload.shape.svg.style.zIndex = `${edge.payload.priority}`;
  }

  private createEdgeRenderPort(
    port: StorePort,
    rectPort: DOMRect,
    rectCanvas: DOMRect,
    viewportMatrix: TransformState,
  ): EdgeRenderPort {
    const viewportPoint: Point = {
      x: rectPort.left - rectCanvas.left,
      y: rectPort.top - rectCanvas.top,
    };

    const contentPoint: Point = transformPoint(viewportMatrix, viewportPoint);

    return {
      x: contentPoint.x,
      y: contentPoint.y,
      width: rectPort.width * viewportMatrix.scale,
      height: rectPort.height * viewportMatrix.scale,
      direction: port.payload.direction,
    };
  }
}
