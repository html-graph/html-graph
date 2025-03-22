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
  .enableUserTransformableViewport({
    events: {
      onTransformChange: () => {
        updateRectangle();
      },
    },
  })
  .enableBoxAreaRendering(trigger)
  .enableUserDraggableNodes()
  .build();

const boundsElement = document.getElementById("bounds")! as HTMLElement;
const boundsContainerElement = document.getElementById(
  "bounds-container",
)! as HTMLElement;

const map = new Map([
  ["x", 0],
  ["y", 0],
  ["width", 1000],
  ["height", 1000],
]);

function updateRectangle(): void {
  const x = map.get("x")!;
  const y = map.get("y")!;
  const width = map.get("width")!;
  const height = map.get("height")!;

  boundsElement.style.width = `${width}px`;
  boundsElement.style.height = `${height}px`;

  const m = canvas.viewport.getContentMatrix();
  boundsContainerElement.style.transform = `matrix(${m.scale}, 0, 0, ${m.scale}, ${m.x}, ${m.y}) translate(${x - 5}px, ${y - 5}px) `;
}

map.forEach((_value, id) => {
  const el: HTMLInputElement = document.getElementById(id)! as HTMLInputElement;
  const valueEl: HTMLElement = document.getElementById(`${id}-value`)!;

  valueEl.innerText = el.value;

  el.addEventListener("input", () => {
    map.set(id, parseFloat(el.value));
    valueEl.innerText = el.value;
    updateRectangle();
  });

  updateRectangle();
  boundsElement.style.visibility = "visible";
});

const canvasElement: HTMLElement = document.getElementById("canvas")!;

canvas.attach(canvasElement);

let cnt = 0;

let prevPortId: unknown | null = null;

for (let i = 0; i < 100; i++) {
  for (let j = 0; j < 100; j++) {
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

const applyEl = document.getElementById("apply")!;

function refresh(): void {
  const x = map.get("x")!;
  const y = map.get("y")!;
  const width = map.get("width")!;
  const height = map.get("height")!;

  trigger.emit({ x, y, width, height });
}

applyEl.addEventListener("click", () => {
  refresh();
});

canvas.patchContentMatrix({ scale: 0.2, x: 250, y: 250 });

refresh();
updateRectangle();
