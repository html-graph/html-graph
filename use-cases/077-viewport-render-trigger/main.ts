import {
  Canvas,
  CanvasBuilder,
  EventSubject,
  RenderingBox,
} from "@html-graph/html-graph";
import { createInOutNode } from "../shared/create-in-out-node";

const trigger = new EventSubject<RenderingBox>();

const canvas: Canvas = new CanvasBuilder()
  .setOptions({
    edges: {
      shape: {
        type: "horizontal",
        hasTargetArrow: true,
      },
    },
  })
  .setUserTransformableViewport()
  .setBoxRenderTrigger(trigger)
  .build();

const canvasElement: HTMLElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

let cnt = 0;

let prevPortId: unknown | null = null;

for (let i = 0; i < 50; i++) {
  for (let j = 0; j < 50; j++) {
    const frontPortId = `node-${cnt}-in`;
    const backPortId = `node-${cnt}-out`;

    canvas.addNode(
      createInOutNode({
        name: `Node ${cnt}`,
        x: j * 300,
        y: i * 300,
        frontPortId,
        backPortId,
      }),
    );

    if (prevPortId !== null) {
      canvas.addEdge({ from: prevPortId, to: frontPortId });
    }

    prevPortId = backPortId;
    cnt++;
  }
}

trigger.emit({ x: 0, y: 0, width: 1000, height: 1000 });
