export class UserDraggableEdgesError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "UserDraggableEdgesError";
  }
}
