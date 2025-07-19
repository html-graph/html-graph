import { Canvas } from "@/canvas";

export class UserDraggableEdgesConfigurator {
  private constructor(private readonly canvas: Canvas) {
    console.log(this.canvas);
  }

  public static configure(canvas: Canvas): void {
    new UserDraggableEdgesConfigurator(canvas);
  }
}
