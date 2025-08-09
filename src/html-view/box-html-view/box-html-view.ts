import { GraphStore } from "@/graph-store";
import { HtmlView } from "../html-view";
import { RenderingBox } from "./rendering-box";
import { EventSubject } from "@/event-subject";
import { RenderingBoxState } from "./rendering-box-state";
import { BoxHtmlViewParams } from "./box-html-view-params";
import { Identifier } from "@/identifier";

/**
 * This entity is responsible for HTML rendering optimization regarding for limited rendering box
 */
export class BoxHtmlView implements HtmlView {
  private readonly attachedNodes = new Set<Identifier>();

  private readonly attachedEdges = new Set<Identifier>();

  private readonly renderingBox: RenderingBoxState;

  private readonly updateViewport = (viewBox: RenderingBox): void => {
    this.renderingBox.setRenderingBox(viewBox);

    const nodesToAttach = new Set<Identifier>();
    const nodesToDetach = new Set<Identifier>();
    const edgesToAttach = new Set<Identifier>();
    const edgesToDetach = new Set<Identifier>();

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
      const fromNodeId = this.graphStore.getPort(edge.from)!.nodeId;
      const toNodeId = this.graphStore.getPort(edge.to)!.nodeId;

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
      if (!this.attachedNodes.has(nodeId)) {
        this.handleAttachNode(nodeId);
      }
    });

    edgesToAttach.forEach((edgeId) => {
      this.handleAttachEdge(edgeId);
    });
  };

  public constructor(
    private readonly htmlView: HtmlView,
    private readonly graphStore: GraphStore,
    private readonly trigger: EventSubject<RenderingBox>,
    private readonly params: BoxHtmlViewParams,
  ) {
    this.renderingBox = new RenderingBoxState(this.graphStore);
    this.trigger.subscribe(this.updateViewport);
  }

  public attachNode(nodeId: Identifier): void {
    if (this.renderingBox.hasNode(nodeId)) {
      this.handleAttachNode(nodeId);
    }
  }

  public detachNode(nodeId: Identifier): void {
    if (this.attachedNodes.has(nodeId)) {
      this.handleDetachNode(nodeId);
    }
  }

  public attachEdge(edgeId: Identifier): void {
    if (!this.renderingBox.hasEdge(edgeId)) {
      return;
    }

    this.attachEdgeEntities(edgeId);
  }

  public detachEdge(edgeId: Identifier): void {
    if (this.attachedEdges.has(edgeId)) {
      this.handleDetachEdge(edgeId);
    }
  }

  public updateNodePosition(nodeId: Identifier): void {
    if (this.attachedNodes.has(nodeId)) {
      this.htmlView.updateNodePosition(nodeId);
    } else {
      if (this.renderingBox.hasNode(nodeId)) {
        this.handleAttachNode(nodeId);

        this.graphStore.getNodeAdjacentEdgeIds(nodeId).forEach((edgeId) => {
          this.attachEdgeEntities(edgeId);
        });
      }
    }
  }

  public updateNodePriority(nodeId: Identifier): void {
    if (this.attachedNodes.has(nodeId)) {
      this.htmlView.updateNodePriority(nodeId);
    }
  }

  public updateEdgeShape(edgeId: Identifier): void {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.updateEdgeShape(edgeId);
    }
  }

  public renderEdge(edgeId: Identifier): void {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.renderEdge(edgeId);
    }
  }

  public updateEdgePriority(edgeId: Identifier): void {
    if (this.attachedEdges.has(edgeId)) {
      this.htmlView.updateEdgePriority(edgeId);
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
    this.trigger.unsubscribe(this.updateViewport);
  }

  private attachEdgeEntities(edgeId: Identifier): void {
    const edge = this.graphStore.getEdge(edgeId)!;
    const nodeFromId = this.graphStore.getPort(edge.from)!.nodeId;
    const nodeToId = this.graphStore.getPort(edge.to)!.nodeId;

    if (!this.attachedNodes.has(nodeFromId)) {
      this.handleAttachNode(nodeFromId);
    }

    if (!this.attachedNodes.has(nodeToId)) {
      this.handleAttachNode(nodeToId);
    }

    this.handleAttachEdge(edgeId);
  }

  private handleAttachNode(nodeId: Identifier): void {
    this.params.onBeforeNodeAttached(nodeId);
    this.attachedNodes.add(nodeId);
    this.htmlView.attachNode(nodeId);
  }

  private handleDetachNode(nodeId: Identifier): void {
    this.htmlView.detachNode(nodeId);
    this.attachedNodes.delete(nodeId);
    this.params.onAfterNodeDetached(nodeId);
  }

  private handleAttachEdge(edgeId: Identifier): void {
    this.attachedEdges.add(edgeId);
    this.htmlView.attachEdge(edgeId);
  }

  private handleDetachEdge(edgeId: Identifier): void {
    this.htmlView.detachEdge(edgeId);
    this.attachedEdges.delete(edgeId);
  }
}
