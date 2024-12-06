export class IdGenerator {
  private counter = 0;

  next(): string {
    const id = `${this.counter}`;

    this.counter++;

    return id;
  }

  reset(): void {
    this.counter = 0;
  }
}
