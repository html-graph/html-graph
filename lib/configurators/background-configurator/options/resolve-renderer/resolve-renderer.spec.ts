import { resolveRenderer } from "./resolve-renderer";

describe("resolveRenderer", () => {
  it("should resolve specified element when svg element provided", () => {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    const resolvedElement = resolveRenderer(element);

    expect(resolvedElement).toBe(element);
  });

  it("should resolve circle element when default configuration is provided", () => {
    const resolvedElement = resolveRenderer({});

    expect(resolvedElement.tagName).toBe("circle");
  });

  it("should resolve circle element with default radius", () => {
    const resolvedElement = resolveRenderer({});

    expect(resolvedElement.getAttribute("r")).toBe("1.5");
  });

  it("should resolve circle element with default color", () => {
    const resolvedElement = resolveRenderer({});

    expect(resolvedElement.getAttribute("fill")).toBe("#d8d8d8");
  });

  it("should resolve circle element with specified radius", () => {
    const resolvedElement = resolveRenderer({ radius: 2 });

    expect(resolvedElement.getAttribute("r")).toBe("2");
  });

  it("should resolve circle element with specified color", () => {
    const resolvedElement = resolveRenderer({ color: "#dddddd" });

    expect(resolvedElement.getAttribute("fill")).toBe("#dddddd");
  });
});
