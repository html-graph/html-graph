import { Viewport } from "@html-graph/html-graph";

const dotColor = "#d8d8d8";
const dotGap = 25;
const dotRadius = 1.5;
const color = "#ffffff";
const limit = 10000;

export const backgroundDrawingFn = (
  ctx: CanvasRenderingContext2D,
  transformer: Viewport,
): void => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const matrixContent = transformer.getContentMatrix();
  const viewGap = dotGap * matrixContent.scale;

  const iterationsHorizontal = ctx.canvas.width / viewGap;
  const iterationsVertical = ctx.canvas.height / viewGap;

  if (iterationsHorizontal * iterationsVertical > limit) {
    return;
  }

  const zeroOffsetX =
    matrixContent.x - Math.floor(matrixContent.x / viewGap) * viewGap;
  const zeroOffsetY =
    matrixContent.y - Math.floor(matrixContent.y / viewGap) * viewGap;

  const r = dotRadius * matrixContent.scale;
  const pi2 = 2 * Math.PI;

  const xFrom = zeroOffsetX - viewGap;
  const yFrom = zeroOffsetY - viewGap;
  const xTo = ctx.canvas.width + zeroOffsetX;
  const yTo = ctx.canvas.height + zeroOffsetY;

  ctx.fillStyle = dotColor;

  for (let x = xFrom; x <= xTo; x += viewGap) {
    for (let y = yFrom; y <= yTo; y += viewGap) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, pi2);
      ctx.closePath();

      ctx.fill();
    }
  }
};
