import { PublicViewportTransformerMock } from "@/viewport-transformer";
import { BackgroundDrawingFn } from "../background-drawing-fn";
import { createNoopBackgroundDrawingFn } from "./create-noop-background-drawing-fn";

describe("createNoopBackgroundDrawingFn", () => {
  it("should create function that does not reference canvas ctx", () => {
    const fn: BackgroundDrawingFn = createNoopBackgroundDrawingFn();

    const ctx = new CanvasRenderingContext2D();
    const transformer = new PublicViewportTransformerMock();

    let referenced = false;

    const ctxProxy = new Proxy(ctx, {
      get(target: typeof ctx, prop: keyof typeof ctx): unknown {
        referenced = true;

        return target[prop];
      },
    });

    fn(ctxProxy, transformer);

    expect(referenced).toBe(false);
  });

  it("should create function that does not reference transformer", () => {
    const fn: BackgroundDrawingFn = createNoopBackgroundDrawingFn();

    const ctx = new CanvasRenderingContext2D();
    const transformer = new PublicViewportTransformerMock();

    let referenced = false;

    const transformerProxy = new Proxy(transformer, {
      get(target: typeof transformer, prop: keyof typeof transformer): unknown {
        referenced = true;

        return target[prop];
      },
    });

    fn(ctx, transformerProxy);

    expect(referenced).toBe(false);
  });
});
