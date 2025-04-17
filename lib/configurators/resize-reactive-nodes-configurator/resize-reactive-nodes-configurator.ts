import { Canvas } from "@/canvas";
import { TwoWayMap } from "./two-way-map";

export class ResizeReactiveNodesConfigurator {
  private readonly nodes = new TwoWayMap<unknown, Element>();

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    const node = this.canvas.graph.getNode(nodeId)!;

    this.nodes.set(nodeId, node.element);
    this.nodesResizeObserver.observe(node.element);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    const element = this.nodes.getByKey(nodeId)!;

    this.nodes.deleteByKey(nodeId);
    this.nodesResizeObserver.unobserve(element);
  };

  private readonly onBeforeClear = (): void => {
    this.nodesResizeObserver.disconnect();
    this.nodes.clear();
  };

  private constructor(private readonly canvas: Canvas) {
    this.nodesResizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;

        this.handleNodeResize(element);
      });
    });

    this.canvas.graph.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);
    this.canvas.graph.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);
    this.canvas.graph.onBeforeClear.subscribe(this.onBeforeClear);
  }

  public static configure(canvas: Canvas): void {
    new ResizeReactiveNodesConfigurator(canvas);
  }

  private handleNodeResize(element: HTMLElement): void {
    const nodeId = this.nodes.getByValue(element)!;

    this.canvas.updateNode(nodeId, {});

    const edges = this.canvas.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edge) => {
      this.canvas.updateEdge(edge);
    });
  }
}
