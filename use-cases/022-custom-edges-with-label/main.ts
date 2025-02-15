import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { EdgeWithLabelShape } from "./edge-with-label-shape";
import { createInOutNode } from "../shared/create-in-out-node";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    edges: {
      shape: {
        hasTargetArrow: true,
      },
    },
  })
  .setUserDraggableNodes()
  .setUserTransformableCanvas()
  .build();

const node1 = createInOutNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-1",
  backPortId: "port-1-2",
});

const node2 = createInOutNode({
  name: "Node 2",
  x: 800,
  y: 600,
  frontPortId: "port-2-1",
  backPortId: "port-2-2",
});

const shape = new EdgeWithLabelShape("Connection");

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode(node1)
  .addNode(node2)
  .addEdge({ id: "edge-1", from: "port-1-2", to: "port-2-1", shape });
