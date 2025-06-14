/**
 * Responsibility: Generated IDs for graph entities
 */
export class IdGenerator {
  private counter = 0;

  public constructor(private readonly checkExists: (id: unknown) => boolean) {}

  public create(suggestedId: unknown | undefined): unknown {
    if (suggestedId !== undefined) {
      return suggestedId;
    }

    while (this.checkExists(this.counter)) {
      this.counter++;
    }

    return this.counter;
  }

  public reset(): void {
    this.counter = 0;
  }
}
