import { createDraggableNodesParams } from "./create-draggable-nodes-params";
import { DraggableNodesConfig } from "./draggable-nodes-config";

describe("createConfig", () => {
  it("should set specified onNodeDrag", () => {
    const onNodeDrag = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onNodeDrag,
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.onNodeDrag).toBe(onNodeDrag);
  });

  it("should set specified legacy nodeDragVerifier", () => {
    const onBeforeNodeDrag = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onBeforeNodeDrag,
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.nodeDragVerifier).toBe(onBeforeNodeDrag);
  });

  it("should set specified legacy nodeDragVerifier", () => {
    const nodeDragVerifier = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      nodeDragVerifier,
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.nodeDragVerifier).toBe(nodeDragVerifier);
  });

  it("should set specified onNodeDragFinished", () => {
    const onNodeDragFinished = (): boolean => true;

    const dragOptions: DraggableNodesConfig = {
      events: {
        onNodeDragFinished,
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.onNodeDragFinished).toBe(onNodeDragFinished);
  });

  it("should set specified dragCursor", () => {
    const dragOptions: DraggableNodesConfig = {
      mouse: {
        dragCursor: "crosshair",
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.dragCursor).toBe("crosshair");
  });

  it("should set default mouse down event verifier", () => {
    const options = createDraggableNodesParams({});
    const verifier = options.mouseDownEventVerifier;

    expect([
      verifier(new MouseEvent("mousedown", { button: 0 })),
      verifier(new MouseEvent("mousedown", { button: 1 })),
    ]).toEqual([true, false]);
  });

  it("should set specified mouse down event verifier", () => {
    const mouseDownEventVerifier = (): boolean => false;

    const dragOptions: DraggableNodesConfig = {
      mouse: {
        mouseDownEventVerifier,
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.mouseDownEventVerifier).toBe(mouseDownEventVerifier);
  });

  it("should set default mouse up event verifier", () => {
    const options = createDraggableNodesParams({});
    const verifier = options.mouseUpEventVerifier;

    expect([
      verifier(new MouseEvent("mouseup", { button: 0 })),
      verifier(new MouseEvent("mouseup", { button: 1 })),
    ]).toEqual([true, false]);
  });

  it("should set specified mouse up event verifier", () => {
    const mouseUpEventVerifier = (): boolean => false;

    const dragOptions: DraggableNodesConfig = {
      mouse: {
        mouseUpEventVerifier,
      },
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.mouseUpEventVerifier).toBe(mouseUpEventVerifier);
  });

  it("should move edges on top by default", () => {
    const dragOptions: DraggableNodesConfig = {};

    const options = createDraggableNodesParams(dragOptions);

    expect(options.moveEdgesOnTop).toBe(true);
  });

  it("should not move edges on top when specified", () => {
    const dragOptions: DraggableNodesConfig = {
      moveEdgesOnTop: false,
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.moveEdgesOnTop).toBe(false);
  });

  it("should move on top by default", () => {
    const dragOptions: DraggableNodesConfig = {};

    const options = createDraggableNodesParams(dragOptions);

    expect(options.moveOnTop).toBe(true);
  });

  it("should not move on top when specified", () => {
    const dragOptions: DraggableNodesConfig = {
      moveOnTop: false,
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.moveOnTop).toBe(false);
  });

  it("should not move edges on top when move on top disabled", () => {
    const dragOptions: DraggableNodesConfig = {
      moveOnTop: false,
    };

    const options = createDraggableNodesParams(dragOptions);

    expect(options.moveEdgesOnTop).toBe(false);
  });
});
