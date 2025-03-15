import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { RenderingBox } from "./rendering-box";
import { EventSubject } from "@/event-subject";
import { RenderingBoxState } from "./rendering-box-state";

/**
 * This entity is responsible for HTML rendering optimization regarding for limited rendering box
 */
export class BoxHtmlView implements HtmlView {
  private readonly attachedNodes = new Set<unknown>();

  private readonly attachedEdges = new Set<unknown>();

  private readonly renderingBox: RenderingBoxState;

  private readonly setRenderingBox = (viewBox: RenderingBox): void => {
    this.renderingBox.setRenderingBox(viewBox);
  };

  private readonly updateEntities = (viewBox: RenderingBox): void => {
    this.renderingBox.setRenderingBox(viewBox);

    const nodesToAttach = new Set<unknown>();
    const nodesToDetach = new Set<unknown>();
    const edgesToAttach = new Set<unknown>();
    const edgesToDetach = new Set<unknown>();

    this.graphStore.getAllNodeIds().forEach((nodeId) => {
      const isInViewport = this.renderingBox.hasNode(nodeId);
      const wasInViewport = this.attachedNodes.has(nodeId);

      if (isInViewport && !wasInViewport) {
        nodesToAttach.add(nodeId);
      } else if (!isInViewport && wasInViewport) {
        nodesToDetach.add(nodeId);
      }
    });

    this.graphStore.getAllEdgeIds().forEach((edgeId) => {
      const isInViewport = this.renderingBox.hasEdge(edgeId);
      const wasInViewport = this.attachedEdges.has(edgeId);
      const edge = this.graphStore.getEdge(edgeId)!;
      const fromNodeId = this.graphStore.getPortNodeId(edge.from);
      const toNodeId = this.graphStore.getPortNodeId(edge.to);

      if (isInViewport) {
        if (!this.renderingBox.hasNode(fromNodeId)) {
          nodesToAttach.add(fromNodeId);
          nodesToDetach.delete(fromNodeId);
        }

        if (!this.renderingBox.hasNode(toNodeId)) {
          nodesToAttach.add(toNodeId);
          nodesToDetach.delete(toNodeId);
        }
      }

      if (isInViewport && !wasInViewport) {
        edgesToAttach.add(edgeId);
      } else if (!isInViewport && wasInViewport) {
        edgesToDetach.add(edgeId);
      }
    });

    edgesToDetach.forEach((edgeId) => {
      this.handleDetachEdge(edgeId);
    });

    nodesToDetach.forEach((nodeId) => {
      this.handleDetachNode(nodeId);
    });

    nodesToAttach.forEach((nodeId) => {
      this.handleAttachNode(nodeId);
    });

    edgesToAttach.forEach((edgeId) => {
      this.handleAttachEdge(edgeId);
    });
  };

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly setRenderingBoxTrigger: EventSubject<RenderingBox>,
    private readonly updateEntitiesTrigger: EventSubject<RenderingBox>,
  ) {
    this.renderingBox = new RenderingBoxState(this.graphStore);
    this.setRenderingBoxTrigger.subscribe(this.setRenderingBox);
    this.updateEntitiesTrigger.subscribe(this.updateEntities);
  }

  public attach(canvasWrapper: HTMLElement): void {
    this.htmlView.attach(canvasWrapper);
  }

  public detach(): void {
    this.htmlView.detach();
  }

  public attachNode(nodeId: unknown): void {
    if (!this.renderingBox.hasNode(nodeId)) {
      return;
    }

    if (!this.attachedNodes.has(nodeId)) {
      this.handleAttachNode(nodeId);
    }
  }

  public detachNode(nodeId: unknown): void {
    if (!this.attachedNodes.has(nodeId)) {
      return;
    }

    this.handleDetachNode(nodeId);
  }

  public attachEdge(edgeId: unknown): void {
    if (!this.renderingBox.hasEdge(edgeId)) {
      return;
    }

    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    if (!this.attachedNodes.has(nodeFromId)) {
      this.handleAttachNode(nodeFromId);
    }

    if (!this.attachedNodes.has(nodeToId)) {
      this.handleAttachNode(nodeToId);
    }

    if (!this.attachedEdges.has(edgeId)) {
      this.handleAttachEdge(edgeId);
    }
  }

  public detachEdge(edgeId: unknown): void {
    if (!this.attachedEdges.has(edgeId)) {
      return;
    }

    this.handleDetachEdge(edgeId);

    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPortNodeId(edge.from)!;
    const nodeToId = this.graphStore.getPortNodeId(edge.to)!;

    if (!this.renderingBox.hasNode(nodeFromId)) {
      this.handleDetachNode(nodeFromId);
    }

    if (!this.renderingBox.hasNode(nodeToId)) {
      this.handleDetachNode(nodeToId);
    }
  }

  public updateNodeCoordinates(nodeId: unknown): void {
    const isInViewport = this.renderingBox.hasNode(nodeId);
    const wasInViewport = this.attachedNodes.has(nodeId);

    if (isInViewport && wasInViewport) {
      this.htmlView.updateNodeCoordinates(nodeId);
    } else if (!isInViewport && wasInViewport) {
      this.handleDetachNode(nodeId);
    } else if (isInViewport && !wasInViewport) {
      this.handleAttachNode(nodeId);
    }
  }

  public updateNodePriority(nodeId: unknown): void {
    const isInViewport = this.renderingBox.hasNode(nodeId);
    const wasInViewport = this.attachedNodes.has(nodeId);

    if (!isInViewport && !wasInViewport) {
      return;
    }

    if (isInViewport && wasInViewport) {
      this.htmlView.updateNodePriority(nodeId);
    } else if (!isInViewport && wasInViewport) {
      this.handleDetachNode(nodeId);
    } else {
      this.handleAttachNode(nodeId);
    }
  }

  public updateEdgeShape(edgeId: unknown): void {
    const isInViewport = this.renderingBox.hasEdge(edgeId);
    const wasInViewport = this.attachedEdges.has(edgeId);

    if (!isInViewport && !wasInViewport) {
      return;
    }

    if (isInViewport && wasInViewport) {
      this.htmlView.updateEdgeShape(edgeId);
    } else if (!isInViewport && wasInViewport) {
      this.htmlView.detachEdge(edgeId);
    } else {
      this.htmlView.attachEdge(edgeId);
    }
  }

  public renderEdge(edgeId: unknown): void {
    const isInViewport = this.renderingBox.hasEdge(edgeId);
    const wasInViewport = this.attachedEdges.has(edgeId);

    if (!isInViewport && !wasInViewport) {
      return;
    }

    if (isInViewport && wasInViewport) {
      this.htmlView.renderEdge(edgeId);
    } else if (!isInViewport && wasInViewport) {
      this.htmlView.detachEdge(edgeId);
    } else {
      this.htmlView.attachEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: unknown): void {
    const isInViewport = this.renderingBox.hasEdge(edgeId);
    const wasInViewport = this.attachedEdges.has(edgeId);

    if (!isInViewport && !wasInViewport) {
      return;
    }

    if (isInViewport && wasInViewport) {
      this.htmlView.updateEdgePriority(edgeId);
    } else if (!isInViewport && wasInViewport) {
      this.htmlView.detachEdge(edgeId);
    } else {
      this.htmlView.attachEdge(edgeId);
    }
  }

  public clear(): void {
    this.htmlView.clear();
    this.attachedNodes.clear();
    this.attachedEdges.clear();
  }

  public destroy(): void {
    this.clear();
    this.htmlView.destroy();
    this.setRenderingBoxTrigger.unsubscribe(this.setRenderingBox);
    this.updateEntitiesTrigger.unsubscribe(this.updateEntities);
  }

  private handleAttachNode(nodeId: unknown): void {
    this.attachedNodes.add(nodeId);
    this.htmlView.attachNode(nodeId);
  }

  private handleDetachNode(nodeId: unknown): void {
    this.htmlView.detachNode(nodeId);
    this.attachedNodes.delete(nodeId);
  }

  private handleAttachEdge(edgeId: unknown): void {
    this.attachedEdges.add(edgeId);
    this.htmlView.attachEdge(edgeId);
  }

  private handleDetachEdge(edgeId: unknown): void {
    this.htmlView.detachEdge(edgeId);
    this.attachedEdges.delete(edgeId);
  }
}
