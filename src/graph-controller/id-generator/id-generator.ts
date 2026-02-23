import { Identifier } from "@/identifier";

export class IdGenerator {
  private counter = 0;

  public constructor(
    private readonly checkExists: (id: Identifier) => boolean,
  ) {}

  public create(suggestedId: Identifier | undefined): Identifier {
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
