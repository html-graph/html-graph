import { createConfig } from "./create-config";
import { DragConfig } from "./drag-config";

describe("createConfig", () => {
  it("should not freeze priority by default", () => {
    const dragOptions: DragConfig = {};

    const options = createConfig(dragOptions);

    expect(options.freezePriority).toBe(false);
  });
  it("should freeze priority when specified", () => {
    const dragOptions: DragConfig = {
      moveOnTop: false,
    };

    const options = createConfig(dragOptions);

    expect(options.freezePriority).toBe(true);
  });

  it("should set specified onNodeDrag", () => {
    const onNodeDrag = (): boolean => true;

    const dragOptions: DragConfig = {
      events: {
        onNodeDrag,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onNodeDrag).toBe(onNodeDrag);
  });

  it("should set specified onBeforeNodeDrag", () => {
    const onBeforeNodeDrag = (): boolean => true;

    const dragOptions: DragConfig = {
      events: {
        onBeforeNodeDrag,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onBeforeNodeDrag).toBe(onBeforeNodeDrag);
  });

  it("should set specified onNodeDragFinished", () => {
    const onNodeDragFinished = (): boolean => true;

    const dragOptions: DragConfig = {
      events: {
        onNodeDragFinished,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onNodeDragFinished).toBe(onNodeDragFinished);
  });

  it("should set specified dragCursor", () => {
    const dragOptions: DragConfig = {
      mouse: {
        dragCursor: "crosshair",
      },
    };

    const options = createConfig(dragOptions);

    expect(options.dragCursor).toBe("crosshair");
  });

  it("should set default mouse down event validator", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const dragOptions: DragConfig = {
      mouse: {
        mouseDownEventVerifier,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set default mouse up event validator", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const dragOptions: DragConfig = {
      mouse: {
        mouseUpEventVerifier,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });
});
