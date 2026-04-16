import { createCanvas, createElement } from "@/mocks";
import { ClosestConnectablePortDraggingPortDirectionResolver } from "./closest-connectable-port-dragging-port-direction-resolver";
import { DraggingPortDirectionResolverParams } from "../dragging-port-direction-resolver-params";

describe("ClosestConnectablePortDraggingPortDirectionResolver", () => {
  it("should resolve default direction when graph has no ports", () => {
    const canvas = createCanvas();

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(
        canvas.graph,
        () => true,
      );

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 0, y: 0 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(undefined);
  });

  it("should resolve direction of a single port", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-1",
          element: createElement({ x: 10, y: 10 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(
        canvas.graph,
        () => true,
      );

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 0, y: 0 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(Math.PI);
  });

  it("should resolve direction of the closest port", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        { id: "port-1", element: createElement({ x: 0, y: 0 }), direction: 0 },
      ],
    });

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(
        canvas.graph,
        () => true,
      );

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 90, y: 90 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(Math.PI);
  });

  it("should take into account only attached ports", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        { id: "port-1", element: createElement({ x: 0, y: 0 }), direction: 0 },
      ],
    });

    canvas.addNode({
      element: createElement(),
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(
        canvas.graph,
        () => true,
      );

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 90, y: 90 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(0);
  });

  it("should take into account only ports with allowed connections", () => {
    const canvas = createCanvas();

    canvas.addNode({
      element: createElement(),
      x: 0,
      y: 0,
      ports: [
        { id: "port-1", element: createElement({ x: 0, y: 0 }), direction: 0 },
      ],
    });

    canvas.addNode({
      element: createElement(),
      x: 100,
      y: 100,
      ports: [
        {
          id: "port-2",
          element: createElement({ x: 100, y: 100 }),
          direction: Math.PI,
        },
      ],
    });

    const portDirectionResolver =
      new ClosestConnectablePortDraggingPortDirectionResolver(
        canvas.graph,
        (request) => request.to !== "port-2",
      );

    const params: DraggingPortDirectionResolverParams = {
      staticPortId: "port-1",
      isDirect: true,
      cursor: { x: 90, y: 90 },
    };

    expect(portDirectionResolver.resolve(params)).toBe(0);
  });
});
