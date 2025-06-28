export class InteractiveEdgeError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InteractiveEdgeError";
  }
}
