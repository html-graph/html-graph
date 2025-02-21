import { createOptions } from "./create-options";
import { DragOptions } from "./drag-options";

describe("createOptions", () => {
  it("should not freeze priority by default", () => {
    const dragOptions: DragOptions = {};

    const options = createOptions(dragOptions);

    expect(options.freezePriority).toBe(false);
  });
  it("should freeze priority when specified", () => {
    const dragOptions: DragOptions = {
      moveOnTop: false,
    };

    const options = createOptions(dragOptions);

    expect(options.freezePriority).toBe(true);
  });

  it("should set specified onNodeDrag", () => {
    const onNodeDrag = (): boolean => true;

    const dragOptions: DragOptions = {
      events: {
        onNodeDrag,
      },
    };

    const options = createOptions(dragOptions);

    expect(options.onNodeDrag).toBe(onNodeDrag);
  });

  it("should set specified onBeforeNodeDrag", () => {
    const onBeforeNodeDrag = (): boolean => true;

    const dragOptions: DragOptions = {
      events: {
        onBeforeNodeDrag,
      },
    };

    const options = createOptions(dragOptions);

    expect(options.onBeforeNodeDrag).toBe(onBeforeNodeDrag);
  });

  it("should set specified onNodeDragFinished", () => {
    const onNodeDragFinished = (): boolean => true;

    const dragOptions: DragOptions = {
      events: {
        onNodeDragFinished,
      },
    };

    const options = createOptions(dragOptions);

    expect(options.onNodeDragFinished).toBe(onNodeDragFinished);
  });

  it("should set specified dragCursor", () => {
    const dragOptions: DragOptions = {
      mouse: {
        dragCursor: "crosshair",
      },
    };

    const options = createOptions(dragOptions);

    expect(options.dragCursor).toBe("crosshair");
  });

  it("should set default mouse down event validator", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const dragOptions: DragOptions = {
      mouse: {
        mouseDownEventVerifier: mouseDownEventVerifier,
      },
    };

    const options = createOptions(dragOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set default mouse up event validator", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const dragOptions: DragOptions = {
      mouse: {
        mouseUpEventVerifier: mouseUpEventVerifier,
      },
    };

    const options = createOptions(dragOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });
});
