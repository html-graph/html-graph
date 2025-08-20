import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  Identifier,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";
import { TopologyGraph } from "./topology-graph";
import { SerializedEdge } from "./serialized-edge";
import { Layout } from "./layout";

import graphData from "./graph.json";

const graph = new TopologyGraph();

graphData.nodes.forEach((nodeId: Identifier) => {
  graph.addNode(nodeId);
});

graphData.edges.forEach((edge: SerializedEdge) => {
  graph.addEdge(edge.id, edge.from, edge.to);
});

const layout = new Layout(graph, 1);

layout.organize();

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .enableUserDraggableNodes()
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

graphData.nodes.forEach((nodeId) => {
  const coords = layout.nodes.get(nodeId)!;

  const addNodeRequest: AddNodeRequest = createInOutNode({
    id: nodeId,
    name: `Node ${nodeId}`,
    x: coords.x,
    y: coords.y,
    frontPortId: `node-${nodeId}-in`,
    backPortId: `node-${nodeId}-out`,
  });

  canvas.addNode(addNodeRequest);
});

graphData.edges.forEach((edge) => {
  const from = `node-${edge.from}-out`;
  const to = `node-${edge.to}-in`;

  canvas.addEdge({ id: edge.id, from, to });
});
