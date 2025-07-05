import { createConfig } from "./create-config";
import { DraggableNodesConfig } from "./draggable-nodes-config";

describe("createConfig", () => {
  it("should set specified onNodeDrag", () => {
    const onNodeDrag = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onNodeDrag,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onNodeDrag).toBe(onNodeDrag);
  });

  it("should set specified onBeforeNodeDrag", () => {
    const onBeforeNodeDrag = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onBeforeNodeDrag,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onBeforeNodeDrag).toBe(onBeforeNodeDrag);
  });

  it("should set specified onNodeDragFinished", () => {
    const onNodeDragFinished = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onNodeDragFinished,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.onNodeDragFinished).toBe(onNodeDragFinished);
  });

  it("should set specified dragCursor", () => {
    const dragOptions: DraggableNodesConfig = {
      mouse: {
        dragCursor: "crosshair",
      },
    };

    const options = createConfig(dragOptions);

    expect(options.dragCursor).toBe("crosshair");
  });

  it("should set default mouse down event validator", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const dragOptions: DraggableNodesConfig = {
      mouse: {
        mouseDownEventVerifier,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set default mouse up event validator", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const dragOptions: DraggableNodesConfig = {
      mouse: {
        mouseUpEventVerifier,
      },
    };

    const options = createConfig(dragOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should move edges on top by default", () => {
    const dragOptions: DraggableNodesConfig = {};

    const options = createConfig(dragOptions);

    expect(options.moveEdgesOnTop).toBe(true);
  });

  it("should not move edges on top when specified", () => {
    const dragOptions: DraggableNodesConfig = {
      moveEdgesOnTop: false,
    };

    const options = createConfig(dragOptions);

    expect(options.moveEdgesOnTop).toBe(false);
  });

  it("should move nodes on top by default", () => {
    const dragOptions: DraggableNodesConfig = {};

    const options = createConfig(dragOptions);

    expect(options.moveNodesOnTop).toBe(true);
  });

  it("should not move nodes on top when specified", () => {
    const dragOptions: DraggableNodesConfig = {
      moveNodesOnTop: false,
    };

    const options = createConfig(dragOptions);

    expect(options.moveNodesOnTop).toBe(false);
  });

  it("should not move nodes on top when move on top disabled", () => {
    const dragOptions: DraggableNodesConfig = {
      moveOnTop: false,
    };

    const options = createConfig(dragOptions);

    expect(options.moveNodesOnTop).toBe(false);
  });

  it("should not move edges on top when move on top disabled", () => {
    const dragOptions: DraggableNodesConfig = {
      moveOnTop: false,
    };

    const options = createConfig(dragOptions);

    expect(options.moveEdgesOnTop).toBe(false);
  });
});
