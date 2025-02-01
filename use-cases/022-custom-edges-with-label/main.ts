import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { EdgeWithLabelShape } from "./edge-with-label-shape";
import { createBasicNode } from "../shared/create-basic-node";

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

const node1 = createBasicNode({
  name: "Node 1",
  x: 200,
  y: 400,
  frontPortId: "port-1-1",
  backPortId: "port-1-2",
});

const node2 = createBasicNode({
  name: "Node 2",
  x: 800,
  y: 600,
  frontPortId: "port-2-1",
  backPortId: "port-2-2",
});

const edgeShape = new EdgeWithLabelShape("Connection");

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode(node1)
  .addNode(node2)
  .addEdge({
    id: "edge-1",
    from: "port-1-2",
    to: "port-2-1",
    shape: {
      type: "custom",
      factory: () => edgeShape,
    },
  });
