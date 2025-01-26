import { PublicViewportTransformerMock } from "@/viewport-transformer";
import { BackgroundDrawingFn } from "../background-drawing-fn";
import { createDotsBackgroundDrawingFn } from "./create-dots-background-drawing-fn";

const createBackgroundFn = (limit: number): BackgroundDrawingFn => {
  return createDotsBackgroundDrawingFn("#d8d8d8", 25, 1.5, "#ffffff", limit);
};

const createCanvasCtx = (): CanvasRenderingContext2D => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", "1000");
  canvas.setAttribute("height", "1000");

  return canvas.getContext("2d")!;
};

describe("createDotsBackgroundDrawingFn", () => {
  it("should create function that clears viewport", () => {
    const fn = createBackgroundFn(10000);
    const ctx = createCanvasCtx();
    const transformer = new PublicViewportTransformerMock();
    const spy = jest.spyOn(ctx, "clearRect");

    fn(ctx, transformer);

    expect(spy).toHaveBeenCalledWith(0, 0, 1000, 1000);
  });

  it("should create function that fills viewport", () => {
    const fn = createBackgroundFn(10000);
    const ctx = createCanvasCtx();
    const transformer = new PublicViewportTransformerMock();
    const spy = jest.spyOn(ctx, "fillRect");

    fn(ctx, transformer);

    expect(spy).toHaveBeenCalledWith(0, 0, 1000, 1000);
  });

  it("should create function that fills viewport with specified color", () => {
    const fn = createBackgroundFn(10000);
    const ctx = createCanvasCtx();
    const transformer = new PublicViewportTransformerMock();
    let color: string | CanvasGradient | CanvasPattern | null = null;

    jest.spyOn(ctx, "fillRect").mockImplementation(() => {
      color = ctx.fillStyle;
    });

    fn(ctx, transformer);

    expect(color).toBe("#ffffff");
  });

  it("should should not draw dots when limit reached", () => {
    const fn = createBackgroundFn(10);
    const ctx = createCanvasCtx();
    const transformer = new PublicViewportTransformerMock();

    const spy = jest.spyOn(ctx, "arc");

    fn(ctx, transformer);

    expect(spy).not.toHaveBeenCalled();
  });
});
