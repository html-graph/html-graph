import { IdGenerator } from "./id-generator";
import { AddEdgeRequest } from "./add-edge-request";
import { AddNodeRequest } from "./add-node-request";
import { MarkPortRequest } from "./mark-port-request";
import { UpdateEdgeRequest } from "./update-edge-request";
import { UpdateNodeRequest } from "./update-node-request";
import { UpdatePortRequest } from "./update-port-request";
import { GraphStore } from "@/graph-store";
import { HtmlView } from "@/html-view";
import { GraphControllerParams } from "./graph-controller-params";
import { Identifier } from "@/identifier";

export class GraphController {
  private readonly nodeIdGenerator = new IdGenerator((nodeId) =>
    this.graphStore.hasNode(nodeId),
  );

  private readonly portIdGenerator = new IdGenerator((portId) =>
    this.graphStore.hasPort(portId),
  );

  private readonly edgeIdGenerator = new IdGenerator((edgeId) =>
    this.graphStore.hasEdge(edgeId),
  );

  private readonly onAfterNodeAdded = (nodeId: Identifier): void => {
    this.htmlView.attachNode(nodeId);
  };

  private readonly onAfterNodeUpdated = (nodeId: Identifier): void => {
    this.htmlView.updateNodePosition(nodeId);

    this.graphStore.getNodeAdjacentEdgeIds(nodeId).forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onAfterNodePriorityUpdated = (nodeId: Identifier): void => {
    this.htmlView.updateNodePriority(nodeId);
  };

  private readonly onBeforeNodeRemoved = (nodeId: Identifier): void => {
    this.graphStore.getNodePortIds(nodeId).forEach((portId) => {
      this.unmarkPort(portId);
    });

    this.htmlView.detachNode(nodeId);
  };

  private readonly onAfterPortUpdated = (portId: Identifier): void => {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edge) => {
      this.htmlView.renderEdge(edge);
    });
  };

  private readonly onBeforePortUnmarked = (portId: Identifier): void => {
    this.graphStore.getPortAdjacentEdgeIds(portId).forEach((edgeId) => {
      this.removeEdge(edgeId);
    });
  };

  private readonly onAfterEdgeAdded = (edgeId: Identifier): void => {
    this.htmlView.attachEdge(edgeId);
  };

  private readonly onAfterEdgeShapeUpdated = (edgeId: Identifier): void => {
    this.htmlView.updateEdgeShape(edgeId);
  };

  private readonly onAfterEdgeUpdated = (edgeId: Identifier): void => {
    this.htmlView.renderEdge(edgeId);
  };

  private readonly onAfterEdgePriorityUpdated = (edgeId: Identifier): void => {
    this.htmlView.updateEdgePriority(edgeId);
  };

  private readonly onBeforeEdgeRemoved = (edgeId: Identifier): void => {
    this.htmlView.detachEdge(edgeId);
  };

  private readonly onBeforeClear = (): void => {
    this.nodeIdGenerator.reset();
    this.portIdGenerator.reset();
    this.edgeIdGenerator.reset();

    this.htmlView.clear();
  };

  public constructor(
    private readonly graphStore: GraphStore,
    private readonly htmlView: HtmlView,
    private readonly params: GraphControllerParams,
  ) {
    this.graphStore.onAfterNodeAdded.subscribe(this.onAfterNodeAdded);

    this.graphStore.onAfterNodeUpdated.subscribe(this.onAfterNodeUpdated);

    this.graphStore.onAfterNodePriorityUpdated.subscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStore.onBeforeNodeRemoved.subscribe(this.onBeforeNodeRemoved);

    this.graphStore.onAfterPortUpdated.subscribe(this.onAfterPortUpdated);

    this.graphStore.onBeforePortRemoved.subscribe(this.onBeforePortUnmarked);

    this.graphStore.onAfterEdgeAdded.subscribe(this.onAfterEdgeAdded);

    this.graphStore.onAfterEdgeShapeUpdated.subscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStore.onAfterEdgeUpdated.subscribe(this.onAfterEdgeUpdated);

    this.graphStore.onAfterEdgePriorityUpdated.subscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStore.onBeforeEdgeRemoved.subscribe(this.onBeforeEdgeRemoved);

    this.graphStore.onBeforeClear.subscribe(this.onBeforeClear);
  }

  public addNode(request: AddNodeRequest): void {
    const nodeId = this.nodeIdGenerator.create(request.id);

    this.graphStore.addNode({
      id: nodeId,
      element: request.element,
      x: request.x ?? null,
      y: request.y ?? null,
      centerFn: request.centerFn ?? this.params.nodes.centerFn,
      priority: request.priority ?? this.params.nodes.priorityFn(),
    });

    if (request.ports !== undefined) {
      for (const port of request.ports) {
        this.markPort({
          id: port.id,
          element: port.element,
          nodeId,
          direction: port.direction,
        });
      }
    }
  }

  public updateNode(
    nodeId: Identifier,
    request?: UpdateNodeRequest | undefined,
  ): void {
    this.graphStore.updateNode(nodeId, request ?? {});
  }

  public removeNode(nodeId: Identifier): void {
    this.graphStore.removeNode(nodeId);
  }

  public markPort(request: MarkPortRequest): void {
    const portId = this.portIdGenerator.create(request.id);

    this.graphStore.addPort({
      id: portId,
      element: request.element,
      nodeId: request.nodeId,
      direction: request.direction ?? this.params.ports.direction,
    });
  }

  public updatePort(
    portId: Identifier,
    request?: UpdatePortRequest | undefined,
  ): void {
    this.graphStore.updatePort(portId, request ?? {});
  }

  public unmarkPort(portId: Identifier): void {
    this.graphStore.removePort(portId);
  }

  public addEdge(request: AddEdgeRequest): void {
    const edgeId = this.edgeIdGenerator.create(request.id);

    this.graphStore.addEdge({
      id: edgeId,
      from: request.from,
      to: request.to,
      shape: request.shape ?? this.params.edges.shapeFactory(edgeId),
      priority: request.priority ?? this.params.edges.priorityFn(),
    });
  }

  public updateEdge(
    edgeId: Identifier,
    request?: UpdateEdgeRequest | undefined,
  ): void {
    this.graphStore.updateEdge(edgeId, request ?? {});
  }

  public removeEdge(edgeId: Identifier): void {
    this.graphStore.removeEdge(edgeId);
  }

  public clear(): void {
    this.graphStore.clear();
  }

  public destroy(): void {
    this.clear();

    this.graphStore.onAfterNodeAdded.unsubscribe(this.onAfterNodeAdded);

    this.graphStore.onAfterNodeUpdated.unsubscribe(this.onAfterNodeUpdated);

    this.graphStore.onAfterNodePriorityUpdated.unsubscribe(
      this.onAfterNodePriorityUpdated,
    );

    this.graphStore.onBeforeNodeRemoved.unsubscribe(this.onBeforeNodeRemoved);

    this.graphStore.onAfterPortUpdated.unsubscribe(this.onAfterPortUpdated);

    this.graphStore.onBeforePortRemoved.unsubscribe(this.onBeforePortUnmarked);

    this.graphStore.onAfterEdgeAdded.unsubscribe(this.onAfterEdgeAdded);

    this.graphStore.onAfterEdgeShapeUpdated.unsubscribe(
      this.onAfterEdgeShapeUpdated,
    );

    this.graphStore.onAfterEdgeUpdated.unsubscribe(this.onAfterEdgeUpdated);

    this.graphStore.onAfterEdgePriorityUpdated.unsubscribe(
      this.onAfterEdgePriorityUpdated,
    );

    this.graphStore.onBeforeEdgeRemoved.unsubscribe(this.onBeforeEdgeRemoved);

    this.graphStore.onBeforeClear.unsubscribe(this.onBeforeClear);

    this.htmlView.destroy();
  }
}
