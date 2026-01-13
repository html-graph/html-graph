import { createAddNodeOverlayRequest } from "./create-add-node-overlay-request";
import { OverlayNodeParams } from "./overlay-node-params";

describe("createAddNodeOverlayRequest", () => {
  it("should create add node overlay request", () => {
    const params: OverlayNodeParams = {
      overlayNodeId: "node",
      portCoords: { x: 10, y: 20 },
      portDirection: Math.PI,
    };

    const request = createAddNodeOverlayRequest(params);

    const element = document.createElement("div");

    expect(request).toEqual({
      id: "node",
      element,
      x: 10,
      y: 20,
      ports: [
        {
          id: "node",
          element: element,
          direction: Math.PI,
        },
      ],
    });
  });
});
