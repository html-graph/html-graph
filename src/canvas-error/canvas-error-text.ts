import { Identifier } from "@/identifier";

export const canvasErrorText = Object.freeze({
  accessNonexistingNode: (nodeId: Identifier): string =>
    `Failed to access node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  addNodeWithExistingId: (nodeId: Identifier): string =>
    `Failed to add node with ID ${JSON.stringify(nodeId)} because a node with this ID already exists`,
  addNodeWithElementInUse: (
    nodeId: Identifier,
    useNodeId: Identifier,
  ): string =>
    `Failed to add node with ID ${JSON.stringify(nodeId)} because its HTML element is already attached to node with ID ${JSON.stringify(useNodeId)}`,
  updateNonexistentNode: (nodeId: Identifier): string =>
    `Failed to update node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  removeNonexistentNode: (nodeId: Identifier): string =>
    `Failed to remove node with ID ${JSON.stringify(nodeId)} because it does not exist`,
  accessNonexistentPort: (portId: Identifier): string =>
    `Failed to access port with ID ${JSON.stringify(portId)} because it does not exist`,
  addPortWithExistingId: (portId: Identifier): string =>
    `Failed to add port with ID ${JSON.stringify(portId)} because a port with this ID already exists`,
  addPortToNonexistentNode: (portId: Identifier, nodeId: Identifier): string =>
    `Failed to add port with ID ${JSON.stringify(portId)} to node with ID ${JSON.stringify(nodeId)} because the node does not exist`,
  updateNonexistentPort: (portId: Identifier): string =>
    `Failed to update port with ID ${JSON.stringify(portId)} because it does not exist`,
  accessPortsOfNonexistentNode: (nodeId: Identifier): string =>
    `Failed to access ports of node with ID ${JSON.stringify(nodeId)} because the node does not exist`,
  removeNonexistentPort: (portId: Identifier): string =>
    `Failed to remove port with ID ${JSON.stringify(portId)} because it does not exist`,
  accessNonexistentEdge: (edgeId: Identifier): string =>
    `Failed to access edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  addEdgeWithExistingId: (edgeId: Identifier): string =>
    `Failed to add edge with ID ${JSON.stringify(edgeId)} because an edge with this ID already exists`,
  addEdgeFromNonexistentPort: (
    edgeId: Identifier,
    portId: Identifier,
  ): string =>
    `Failed to add edge with ID ${JSON.stringify(edgeId)} from port with ID ${JSON.stringify(portId)} because the port does not exist`,
  addEdgeToNonexistentPort: (edgeId: Identifier, portId: Identifier): string =>
    `Failed to add edge with ID ${JSON.stringify(edgeId)} to port with ID ${JSON.stringify(portId)} because the port does not exist`,
  updateNonexistentEdge: (edgeId: Identifier): string =>
    `Failed to update edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  updateNonexistentEdgeSource: (
    edgeId: Identifier,
    portId: Identifier,
  ): string =>
    `Failed to update source of edge with ID ${JSON.stringify(edgeId)} because source port with ID ${JSON.stringify(portId)} does not exist`,
  updateNonexistentEdgeTarget: (
    edgeId: Identifier,
    portId: Identifier,
  ): string =>
    `Failed to update target of edge with ID ${JSON.stringify(edgeId)} because target port with ID ${JSON.stringify(portId)} does not exist`,
  removeNonexistentEdge: (edgeId: Identifier): string =>
    `Failed to remove edge with ID ${JSON.stringify(edgeId)} because it does not exist`,
  accessEdgesForNonexistentPort: (portId: Identifier): string =>
    `Failed to access edges for port with ID ${JSON.stringify(portId)} because the port does not exist`,
});
