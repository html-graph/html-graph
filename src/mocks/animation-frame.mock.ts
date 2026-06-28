import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { Mock } from "vitest";

export class AnimationFrameMock {
  private callbacks: Array<(dtSec: number) => void> = [];

  public readonly timerHandler: EventHandler<number>;

  public readonly timer: EventEmitter<number>;

  private spy!: Mock;

  public constructor() {
    [this.timer, this.timerHandler] = createPair<number>();

    this.timerHandler.subscribe((dt) => {
      const p: Array<() => void> = [];

      this.callbacks.forEach((cb) => {
        p.push(() => {
          cb(dt);
        });
      });

      this.callbacks = [];

      p.forEach((cb) => {
        cb();
      });
    });
  }

  public hook(): void {
    this.spy = vi.spyOn(window, "requestAnimationFrame");

    this.spy.mockImplementation((callback) => {
      this.callbacks.push(callback);

      return 0;
    });
  }

  public unhook(): void {
    this.spy.mockRestore();
  }
}
