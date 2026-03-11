import { Identifier } from "@/identifier";

export const canvasErrorText = {
  accessNonexistingNode: (nodeId: Identifier): string =>
    `failed to access nonexistent node with id of ${JSON.stringify(nodeId)}`,
  addNodeWithExistingId: (nodeId: Identifier): string =>
    `failed to add node with existing id of ${JSON.stringify(nodeId)}`,
  addNodeWithElementInUse: (nodeId: Identifier): string =>
    `failed to add node with html element already in use by another node with id of ${JSON.stringify(nodeId)}`,
  updateNonexistentNode: (nodeId: Identifier): string =>
    `failed to update nonexistent node with id of ${JSON.stringify(nodeId)}`,
  removeNonexistentNode: (nodeId: Identifier): string =>
    `failed to remove nonexistent node with id of ${JSON.stringify(nodeId)}`,
  accessNonexistentPort: (portId: Identifier): string =>
    `failed to access nonexistent port with id of ${JSON.stringify(portId)}`,
  addPortWithExistingId: (portId: Identifier): string =>
    `failed to add port with existing id of ${JSON.stringify(portId)}`,
  addPortToNonexistentNode: (nodeId: Identifier): string =>
    `failed to add port to nonexistent node with id of ${JSON.stringify(nodeId)}`,
  updateNonexistentPort: (portId: Identifier): string =>
    `failed to update nonexistent port with id of ${JSON.stringify(portId)}`,
  accessPortsOfNonexistentNode: (nodeId: Identifier): string =>
    `failed to access port ids of nonexistent node with id of ${JSON.stringify(nodeId)}`,
  removeNonexistentPort: (portId: Identifier): string =>
    `failed to remove nonexistent port with id of ${JSON.stringify(portId)}`,
  accessNonexistentEdge: (edgeId: Identifier): string =>
    `failed to access nonexistent edge with id of ${JSON.stringify(edgeId)}`,
  addEdgeWithExistingId: (edgeId: Identifier): string =>
    `failed to add edge with existing id of ${JSON.stringify(edgeId)}`,
  addEdgeFromNonexistentPort: (portId: Identifier): string =>
    `failed to add edge from nonexistent port with id of ${JSON.stringify(portId)}`,
  addEdgeToNonexistentPort: (portId: Identifier): string =>
    `failed to add edge to nonexistent port with id of ${JSON.stringify(portId)}`,
  updateNonexistentEdge: (edgeId: Identifier): string =>
    `failed to update nonexistent edge with id of ${JSON.stringify(edgeId)}`,
  removeNonexistentEdge: (edgeId: Identifier): string =>
    `failed to remove nonexistent edge with id of ${JSON.stringify(edgeId)}`,
  accessEdgesForNonexistentPort: (portId: Identifier): string =>
    `failed to access edges for nonexistent port with id of ${JSON.stringify(portId)}`,
};
