export class IdGenerator {
  private counter = 0;

  public create(): string {
    const id = `${this.counter}`;

    this.counter++;

    return id;
  }

  public reset(): void {
    this.counter = 0;
  }
}
