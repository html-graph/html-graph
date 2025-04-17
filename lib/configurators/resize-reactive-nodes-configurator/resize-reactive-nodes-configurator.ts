import { Canvas } from "@/canvas";

export class ResizeReactiveNodesConfigurator {
  private readonly elementToNodeId = new Map<Element, unknown>();

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly onAfterNodeAdded = (nodeId: unknown): void => {
    const node = this.canvas.graph.getNode(nodeId)!;

    this.elementToNodeId.set(node.element, nodeId);
    this.nodesResizeObserver.observe(node.element);
  };

  private readonly onBeforeNodeRemoved = (nodeId: unknown): void => {
    const node = this.canvas.graph.getNode(nodeId)!;

    this.elementToNodeId.delete(node.element);
    this.nodesResizeObserver.unobserve(node.element);
  };

  private readonly onBeforeClear = (): void => {
    this.nodesResizeObserver.disconnect();
    this.elementToNodeId.clear();
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
    const nodeId = this.elementToNodeId.get(element)!;

    this.canvas.updateNode(nodeId);

    const edges = this.canvas.graph.getNodeAdjacentEdgeIds(nodeId)!;

    edges.forEach((edge) => {
      this.canvas.updateEdge(edge);
    });
  }
}
