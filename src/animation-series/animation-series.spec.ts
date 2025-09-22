import { AnimationSeries } from "./animation-series";
import { AnimationFrameMock } from "@/mocks";

describe("AnimationSeries", () => {
  const animationMock = new AnimationFrameMock();

  beforeEach(() => {
    animationMock.hook();
  });

  afterEach(() => {
    animationMock.unhook();
  });

  it("should call callback with latest frames difference", () => {
    const callback = jest.fn();
    new AnimationSeries(window, callback);

    animationMock.timer.emit(100);
    animationMock.timer.emit(300);

    expect(callback).toHaveBeenCalledWith(0.2);
  });
});
