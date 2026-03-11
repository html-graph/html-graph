import { Identifier } from "@/identifier";

export const canvasErrorText = {
  accessNonexistingNode: (nodeId: Identifier): string =>
    `failed to access nonexistent node with ID of ${JSON.stringify(nodeId)}`,
  addNodeWithExistingId: (nodeId: Identifier): string =>
    `failed to add node with existing ID of ${JSON.stringify(nodeId)}`,
  addNodeWithElementInUse: (
    nodeId: Identifier,
    useNodeId: Identifier,
  ): string =>
    `failed to add node with ID of ${JSON.stringify(nodeId)} with html element already in use by another node with ID of ${JSON.stringify(useNodeId)}`,
  updateNonexistentNode: (nodeId: Identifier): string =>
    `failed to update nonexistent node with ID of ${JSON.stringify(nodeId)}`,
  removeNonexistentNode: (nodeId: Identifier): string =>
    `failed to remove nonexistent node with ID of ${JSON.stringify(nodeId)}`,
  accessNonexistentPort: (portId: Identifier): string =>
    `failed to access nonexistent port with ID of ${JSON.stringify(portId)}`,
  addPortWithExistingId: (portId: Identifier): string =>
    `failed to add port with existing ID of ${JSON.stringify(portId)}`,
  addPortToNonexistentNode: (nodeId: Identifier): string =>
    `failed to add port to nonexistent node with ID of ${JSON.stringify(nodeId)}`,
  updateNonexistentPort: (portId: Identifier): string =>
    `failed to update nonexistent port with ID of ${JSON.stringify(portId)}`,
  accessPortsOfNonexistentNode: (nodeId: Identifier): string =>
    `failed to access ports of nonexistent node with ID of ${JSON.stringify(nodeId)}`,
  removeNonexistentPort: (portId: Identifier): string =>
    `failed to remove nonexistent port with ID of ${JSON.stringify(portId)}`,
  accessNonexistentEdge: (edgeId: Identifier): string =>
    `failed to access nonexistent edge with ID of ${JSON.stringify(edgeId)}`,
  addEdgeWithExistingId: (edgeId: Identifier): string =>
    `failed to add edge with existing ID of ${JSON.stringify(edgeId)}`,
  addEdgeFromNonexistentPort: (portId: Identifier): string =>
    `failed to add edge from nonexistent port with ID of ${JSON.stringify(portId)}`,
  addEdgeToNonexistentPort: (portId: Identifier): string =>
    `failed to add edge to nonexistent port with ID of ${JSON.stringify(portId)}`,
  updateNonexistentEdge: (edgeId: Identifier): string =>
    `failed to update nonexistent edge with ID of ${JSON.stringify(edgeId)}`,
  updateNonexistentEdgeSource: (
    edgeId: Identifier,
    portId: Identifier,
  ): string =>
    `failed to update edge with ID of ${JSON.stringify(edgeId)} with nonexistent source port with ID of ${JSON.stringify(portId)}`,
  updateNonexistentEdgeTarget: (
    edgeId: Identifier,
    portId: Identifier,
  ): string =>
    `failed to update edge with ID of ${JSON.stringify(edgeId)} with nonexistent target port with ID of ${JSON.stringify(portId)}`,
  removeNonexistentEdge: (edgeId: Identifier): string =>
    `failed to remove nonexistent edge with ID of ${JSON.stringify(edgeId)}`,
  accessEdgesForNonexistentPort: (portId: Identifier): string =>
    `failed to access edges for nonexistent port with ID of ${JSON.stringify(portId)}`,
};
