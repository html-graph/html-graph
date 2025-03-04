import {
  AddNodeRequest,
  Canvas,
  HtmlGraphBuilder,
  TransformOptions,
} from "@html-graph/html-graph";

let dragging: boolean = false;

const onBeforeTransformStarted = (): void => {
  dragging = true;
};

const builder: HtmlGraphBuilder = new HtmlGraphBuilder();

const transformOptions: TransformOptions = {
  events: {
    onBeforeTransformChange: onBeforeTransformStarted,
  },
};

const canvas: Canvas = builder
  .setUserTransformableViewport(transformOptions)
  .build();

let angle = 0;

const canvasElement: HTMLElement = document.getElementById("canvas")!;

canvasElement.addEventListener("mouseup", () => {
  setTimeout(() => {
    dragging = false;
  });
});

canvas.attach(canvasElement);

const createNode: () => void = () => {
  const node = document.createElement("div");
  node.classList.add("node");

  const btn = document.createElement("button");
  btn.innerText = "Add Node";
  btn.addEventListener("click", () => {
    if (!dragging) {
      createNode();
    }
  });

  node.appendChild(btn);

  const addNodeRequest: AddNodeRequest = {
    element: node,
    x: Math.cos(angle) * (300 + 300 * Math.floor(angle / (2 * Math.PI))) + 400,
    y: Math.sin(angle) * (300 + 300 * Math.floor(angle / (2 * Math.PI))) + 400,
  };

  canvas.addNode(addNodeRequest);

  angle += Math.PI / 6;
};

createNode();
