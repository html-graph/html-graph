import { createCanvas, createElement } from "@/mocks";
import { ClosestConnectablePortDraggingPortDirectionResolver } from "./closest-connectable-port-dragging-port-direction-resolver";

describe("ClosestConnectablePortDraggingPortDirectionResolver", () => {
  it("should resolve default direction when graph has no ports", () => {
    const canvas = createCanvas();

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(canvas.graph);

    expect(portDirectionResolver.resolve({ x: 0, y: 0 })).toBe(undefined);
  });

  it("should resolve direction of a single port", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        { id: 0, element: createElement({ x: 10, y: 10 }), direction: Math.PI },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(canvas.graph);

    expect(portDirectionResolver.resolve({ x: 0, y: 0 })).toBe(Math.PI);
  });

  it("should resolve direction of the closest port", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [{ id: 0, element: createElement({ x: 0, y: 0 }), direction: 0 }],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: 1,
          element: createElement({ x: 100, y: 100 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(canvas.graph);

    expect(portDirectionResolver.resolve({ x: 90, y: 90 })).toBe(Math.PI);
  });

  it("should not take into account not attached ports", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [{ id: 0, element: createElement({ x: 0, y: 0 }), direction: 0 }],
    });

    canvas.addNode({
      element: createElement(),
      ports: [
        {
          id: 1,
          element: createElement({ x: 100, y: 100 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(canvas.graph);

    expect(portDirectionResolver.resolve({ x: 90, y: 90 })).toBe(0);
  });
});
