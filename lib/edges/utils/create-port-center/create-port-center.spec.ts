import { createPortCenter } from "./create-port-center";
import { GraphPort } from "@/graph-store";

describe("createPortCenter", () => {
  it("should create port center point", () => {
    const port: GraphPort = {
      element: document.createElement("div"),
      centerFn: (w, h) => ({ x: w / 2, y: h / 2 }),
      direction: 0,
    };

    jest
      .spyOn(port.element, "getBoundingClientRect")
      .mockReturnValue(new DOMRect(1, 1, 2, 2));

    const center = createPortCenter(port);
    expect(center).toEqual({ x: 2, y: 2 });
  });
});
