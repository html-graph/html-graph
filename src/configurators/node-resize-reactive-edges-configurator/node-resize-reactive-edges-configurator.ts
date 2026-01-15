import { Canvas } from "@/canvas";
import { Identifier } from "@/identifier";

export class NodeResizeReactiveEdgesConfigurator {
  private readonly elementToNodeId = new Map<Element, Identifier>();

  private readonly nodesResizeObserver: ResizeObserver;

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    const node = this.canvas.graph.getNode(nodeId);

    this.elementToNodeId.set(node.element, nodeId);
    this.nodesResizeObserver.observe(node.element);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    const node = this.canvas.graph.getNode(nodeId);

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
    new NodeResizeReactiveEdgesConfigurator(canvas);
  }

  private handleNodeResize(element: HTMLElement): void {
    const nodeId = this.elementToNodeId.get(element)!;

    this.canvas.updateNode(nodeId);
  }
}
