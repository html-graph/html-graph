import { createPair, EventEmitter, EventHandler } from "@/event-subject";
import { Point } from "@/point";

export class Waypoints {
  private value: readonly Point[] = [];

  public readonly onChange: EventHandler<void>;

  private readonly changeEmitter: EventEmitter<void>;

  public constructor() {
    [this.changeEmitter, this.onChange] = createPair<void>();
  }

  public setValue(value: readonly Point[]): void {
    this.value = value;
    this.changeEmitter.emit();
  }

  public getValue(): readonly Point[] {
    return this.value;
  }
}
