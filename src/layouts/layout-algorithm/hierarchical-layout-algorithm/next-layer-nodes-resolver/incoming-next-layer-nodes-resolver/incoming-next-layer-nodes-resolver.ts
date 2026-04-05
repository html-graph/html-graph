import { NextLayerNodesResolver } from "../next-layer-nodes-resolver";
import { NextLayerNodesResolverParams } from "../next-layer-nodes-resolver-params";

export const incomingNextLayerNodesResolver: NextLayerNodesResolver = (
  params: NextLayerNodesResolverParams,
) => {
  const { graph, currentNodeId } = params;

  const outgoingNodeIds = graph
    .getNodeIncomingEdgeIds(currentNodeId)
    .map((edgeId) => {
      const edge = graph.getEdge(edgeId);
      const port = graph.getPort(edge.from);

      return port.nodeId;
    });

  return new Set(outgoingNodeIds);
};
