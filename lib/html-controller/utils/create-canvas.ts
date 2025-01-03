export const createCanvas: () => HTMLCanvasElement = () => {
  const canvas = document.createElement("canvas");

  canvas.style.position = "absolute";
  canvas.style.inset = "0";

  return canvas;
};
