import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { CustomEdgeShape } from "./custom-edge-shape";
import { createBasicNode } from "../create-basic-node";

const canvas = new HtmlGraphBuilder()
  .setOptions({
    background: {
      type: "dots",
    },
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
  frontPortId: "port-1-1",
  backPortId: "port-1-2",
  x: 200,
  y: 400,
});

const node2 = createBasicNode({
  name: "Node 2",
  frontPortId: "port-2-1",
  backPortId: "port-2-2",
  x: 470,
  y: 600,
});

const canvasElement = document.getElementById("canvas")!;

canvas
  .attach(canvasElement)
  .addNode(node1)
  .addNode(node2)
  .addEdge({
    from: "port-1-2",
    to: "port-2-1",
    options: {
      type: "custom",
      factory: () => new CustomEdgeShape("Connection 1"),
    },
  });
