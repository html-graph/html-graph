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

    const afterFirst = this.first.previous;
    afterFirst!.next = null;
    this.first = afterFirst;

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
    const last = this.last!;
    const newLast: QueueEntry<T> = { value, next: last, previous: null };
    last.previous = newLast;
    this.last = newLast;
  }
}
