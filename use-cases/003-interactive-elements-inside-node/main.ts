import {
  AddNodeRequest,
  Canvas,
  CanvasBuilder,
  ViewportTransformConfig,
} from "@html-graph/html-graph";

let transformInProgress: boolean = false;
let preventClick: boolean = false;

const canvasElement: HTMLElement = document.getElementById("canvas")!;
const builder: CanvasBuilder = new CanvasBuilder(canvasElement);

const transformOptions: ViewportTransformConfig = {
  events: {
    onTransformStarted: () => {
      transformInProgress = true;
    },
    onTransformChange: () => {
      if (transformInProgress) {
        preventClick = true;
      }
    },
    onTransformFinished: () => {
      transformInProgress = false;
      setTimeout(() => {
        preventClick = false;
      });
    },
  },
};

const canvas: Canvas = builder
  .enableUserTransformableViewport(transformOptions)
  .build();

let angle = 0;

const createNode: () => void = () => {
  const node = document.createElement("div");
  node.classList.add("node");

  const btn = document.createElement("button");
  btn.innerText = "Add Node";
  btn.addEventListener("click", () => {
    if (preventClick) {
      return;
    }

    createNode();
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
