import { QueueEntry } from "./queue-entry";

export class Queue<T> {
  private first: QueueEntry<T> | null = null;

  private last: QueueEntry<T> | null = null;

  public pop(): T | null {
    if (this.first === null) {
      return null;
    }

    if (this.first === this.last) {
      const result = this.first.value;

      this.first = null;
      this.last = null;

      return result;
    }

    const result = this.first.value;

    const newFirst = this.first.previous!;
    newFirst.next = null;
    this.first = newFirst;

    return result;
  }

  public push(value: T): void {
    if (this.first === null) {
      const entry: QueueEntry<T> = { value, previous: null, next: null };
      this.last = entry;
      this.first = this.last;

      return;
    }

    if (this.first === this.last) {
      const newLast: QueueEntry<T> = {
        value,
        next: this.first,
        previous: null,
      };

      this.first.previous = newLast;
      this.last = newLast;
      return;
    }

    const oldLast = this.last!;
    const newLast: QueueEntry<T> = { value, next: oldLast, previous: null };
    oldLast.previous = newLast;
    this.last = newLast;
  }
}
