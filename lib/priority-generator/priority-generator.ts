export class PriorityGenerator {
  private priority = 0;

  public create(): number {
    const priority = this.priority;

    this.priority++;

    return priority;
  }

  public push(priority: number): void {
    this.priority = Math.max(this.priority, priority);
  }

  public reset(): void {
    this.priority = 0;
  }
}
