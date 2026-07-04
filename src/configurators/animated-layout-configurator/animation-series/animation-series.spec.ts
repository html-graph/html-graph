import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import { AnimationSeries } from "./animation-series";
import { AnimationFrameMock } from "@/mocks/animation-frame.mock";

describe("AnimationSeries", () => {
  const animationMock = new AnimationFrameMock();

  beforeEach(() => {
    animationMock.hook();
  });

  afterEach(() => {
    animationMock.unhook();
  });

  it("should call callback with latest frames difference", () => {
    const callback = vi.fn();
    new AnimationSeries(window, callback);

    animationMock.timer.emit(100);
    animationMock.timer.emit(300);

    expect(callback).toHaveBeenCalledWith(0.2);
  });
});
