import { Point } from "@/point";
import { GraphStore, StorePort } from "@/graph-store";
import { ViewportStore } from "@/viewport-store";
import { EdgeRenderPort } from "@/edges";
import { HtmlView } from "../html-view";
import { ConnectionCategory } from "@/edges/connection-category";
import { createHost } from "./create-host";
import { createContainer } from "./create-container";
import { prepareNodeElement } from "./prepare-node-element";
import { Identifier } from "@/identifier";

export class CoreHtmlView implements HtmlView {
  private readonly host = createHost();

  private readonly container = createContainer();

  private readonly edgeIdToElementMap = new Map<Identifier, SVGSVGElement>();

  private readonly attachedNodeIds = new Set<Identifier>();

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

  public attachNode(nodeId: Identifier): void {
    const node = this.graphStore.getNode(nodeId)!;

    prepareNodeElement(node.element);

    this.attachedNodeIds.add(nodeId);
    this.container.appendChild(node.element);

    this.updateNodePosition(nodeId);
    this.updateNodePriority(nodeId);

    node.element.style.visibility = "visible";
  }

  public detachNode(nodeId: Identifier): void {
    const node = this.graphStore.getNode(nodeId)!;

    this.container.removeChild(node.element);
    this.attachedNodeIds.delete(nodeId);
  }

  public attachEdge(edgeId: Identifier): void {
    const svg = this.graphStore.getEdge(edgeId)!.payload.shape.svg;

    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);

    this.renderEdge(edgeId);
    this.updateEdgePriority(edgeId);
  }

  public detachEdge(edgeId: Identifier): void {
    const svg = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(svg);
    this.edgeIdToElementMap.delete(edgeId);
  }

  public clear(): void {
    this.edgeIdToElementMap.forEach((_element, edgeId) => {
      this.detachEdge(edgeId);
    });

    this.attachedNodeIds.forEach((nodeId) => {
      this.detachNode(nodeId);
    });
  }

  public destroy(): void {
    this.viewportStore.onAfterUpdated.unsubscribe(this.applyTransform);

    this.element.removeChild(this.host);
    this.host.removeChild(this.container);
  }

  public updateNodePosition(nodeId: Identifier): void {
    const node = this.graphStore.getNode(nodeId)!;
    const { width, height } = node.element.getBoundingClientRect();
    const viewportScale = this.viewportStore.getViewportMatrix().scale;
    const { payload } = node;
    const center = payload.centerFn(width, height);

    const x = payload.x! - viewportScale * center.x;
    const y = payload.y! - viewportScale * center.y;

    node.element.style.transform = `translate(${x}px, ${y}px)`;
  }

  public updateNodePriority(nodeId: Identifier): void {
    const node = this.graphStore.getNode(nodeId)!;

    node.element.style.zIndex = `${node.payload.priority}`;
  }

  public updateEdgeShape(edgeId: Identifier): void {
    const element = this.edgeIdToElementMap.get(edgeId)!;

    this.container.removeChild(element);

    const edge = this.graphStore.getEdge(edgeId)!;

    const svg = edge.payload.shape.svg;

    this.edgeIdToElementMap.set(edgeId, svg);
    this.container.appendChild(svg);
  }

  public renderEdge(edgeId: Identifier): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const portFrom = this.graphStore.getPort(edge.from)!;
    const portTo = this.graphStore.getPort(edge.to)!;

    const rectFrom = portFrom.element.getBoundingClientRect();
    const rectTo = portTo.element.getBoundingClientRect();
    const rectCanvas = this.host.getBoundingClientRect();

    const from = this.createEdgeRenderPort(portFrom, rectFrom, rectCanvas);

    const to = this.createEdgeRenderPort(portTo, rectTo, rectCanvas);

    let category = ConnectionCategory.Line;

    if (portFrom.element === portTo.element) {
      category = ConnectionCategory.PortCycle;
    } else if (portFrom.nodeId === portTo.nodeId) {
      category = ConnectionCategory.NodeCycle;
    }

    edge.payload.shape.render({ from, to, category });
  }

  public updateEdgePriority(edgeId: Identifier): void {
    const edge = this.graphStore.getEdge(edgeId)!;

    edge.payload.shape.svg.style.zIndex = `${edge.payload.priority}`;
  }

  private createEdgeRenderPort(
    port: StorePort,
    rectPort: DOMRect,
    rectCanvas: DOMRect,
  ): EdgeRenderPort {
    const viewportPoint: Point = {
      x: rectPort.left - rectCanvas.left,
      y: rectPort.top - rectCanvas.top,
    };

    const contentPoint: Point =
      this.viewportStore.createContentCoords(viewportPoint);
    const scale = this.viewportStore.getViewportMatrix().scale;

    return {
      x: contentPoint.x,
      y: contentPoint.y,
      width: rectPort.width * scale,
      height: rectPort.height * scale,
      direction: port.payload.direction,
    };
  }
}
