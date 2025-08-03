export class Queue<T> {
  private first: T | null = null;

  private last: T | null = null;

  public pop(): T | null {
    if (this.first !== null) {
      const first = this.first;
      this.first = null;

      return first;
    } else {
      const last = this.last;
      this.last = null;

      return last;
    }
  }

  public push(value: T): void {
    if (this.first === null) {
      this.first = value;
    } else {
      this.last = value;
    }
  }
}
