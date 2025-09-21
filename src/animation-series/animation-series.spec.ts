import { EventSubject } from "@/event-subject";
import { AnimationSeries } from "./animation-series";

describe("AnimationSeries", () => {
  const callbacks = new Set<(dtSec: number) => void>();
  const timer = new EventSubject<number>();

  timer.subscribe((dt) => {
    const p: Array<() => void> = [];

    callbacks.forEach((cb) => {
      p.push(() => {
        cb(dt);
      });
    });

    callbacks.clear();

    p.forEach((cb) => {
      cb();
    });
  });

  let spy: jest.SpyInstance<number, [callback: FrameRequestCallback], unknown>;

  beforeAll(() => {
    spy = jest.spyOn(window, "requestAnimationFrame");

    spy.mockImplementation((callback) => {
      callbacks.add(callback);

      return 0;
    });
  });

  afterAll(() => {
    spy.mockRestore();
  });

  it("should call callback with latest frames difference", () => {
    const callback = jest.fn();
    new AnimationSeries(window, callback);

    timer.emit(100);
    timer.emit(300);

    expect(callback).toHaveBeenCalledWith(0.2);
  });
});
