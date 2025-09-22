import { createPair, EventEmitter, EventHandler } from "@/event-subject";

export class AnimationFrameMock {
  private readonly callbacks = new Set<(dtSec: number) => void>();

  public readonly timerHandler: EventHandler<number>;

  public readonly timer: EventEmitter<number>;

  private spy!: jest.SpyInstance<
    number,
    [callback: FrameRequestCallback],
    unknown
  >;

  public constructor() {
    [this.timer, this.timerHandler] = createPair<number>();

    this.timerHandler.subscribe((dt) => {
      const p: Array<() => void> = [];

      this.callbacks.forEach((cb) => {
        p.push(() => {
          cb(dt);
        });
      });

      this.callbacks.clear();

      p.forEach((cb) => {
        cb();
      });
    });
  }

  public hook(): void {
    this.spy = jest.spyOn(window, "requestAnimationFrame");

    this.spy.mockImplementation((callback) => {
      this.callbacks.add(callback);

      return 0;
    });
  }

  public unhook(): void {
    this.spy.mockRestore();
  }
}
