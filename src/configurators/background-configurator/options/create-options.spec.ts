import { createOptions } from "./create-options";

describe("createOptions", () => {
  it("should resolve 25 tile width by default", () => {
    const options = createOptions({});

    expect(options.tileWidth).toBe(25);
  });

  it("should resolve specified tile width", () => {
    const options = createOptions({ tileDimensions: { width: 10 } });

    expect(options.tileWidth).toBe(10);
  });

  it("should resolve 25 tile height by default", () => {
    const options = createOptions({});

    expect(options.tileHeight).toBe(25);
  });

  it("should resolve specified tile height", () => {
    const options = createOptions({ tileDimensions: { height: 10 } });

    expect(options.tileHeight).toBe(10);
  });

  it("should resolve 10 max viewport scale by default", () => {
    const options = createOptions({});

    expect(options.maxViewportScale).toBe(10);
  });

  it("should resolve specified max viewport scale", () => {
    const options = createOptions({ maxViewportScale: 15 });

    expect(options.maxViewportScale).toBe(15);
  });

  it("should resolve circle renderer by default", () => {
    const options = createOptions({});

    expect(options.renderer.tagName).toBe("circle");
  });

  it("should resolve specified renderer by default", () => {
    const options = createOptions({ renderer: { radius: 5 } });

    expect(options.renderer.getAttribute("r")).toBe("5");
  });
});
