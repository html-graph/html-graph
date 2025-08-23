import { AddNodeRequest, Canvas, CanvasBuilder } from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

import graphData from "./graph.json";
import { HeirarchicalLayout } from "./heirarchical-layout";

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);
const canvas: Canvas = builder
  .enableUserTransformableViewport()
  .enableBackground()
  .build();

graphData.nodes.forEach((nodeId) => {
  const addNodeRequest: AddNodeRequest = createInOutNode({
    id: nodeId,
    name: `Node ${nodeId}`,
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

const layout = new HeirarchicalLayout(canvas, {
  startNodeId: 0,
  layerSize: 300,
  layerSpace: 200,
  transformMatrix: {
    a: 1,
    b: 0,
    c: 200,
    d: 0,
    e: 1,
    f: 400,
  },
});

layout.organize();
