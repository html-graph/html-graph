import { HtmlGraphBuilder } from "@html-graph/html-graph";
import { EdgeWithLabelShape } from "./edge-with-label-shape";
import { createBasicNode } from "../shared/create-basic-node";

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

const edgeShape1 = new EdgeWithLabelShape("Connection");

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
      factory: () => edgeShape1,
    },
  });

let i = 0;

setInterval(() => {
  const edgeShape2 = new EdgeWithLabelShape(`Connection ${i}`);

  canvas.updateEdge("edge-1", {
    shape: { type: "custom", factory: () => edgeShape2 },
  });

  i++;
}, 1000);
