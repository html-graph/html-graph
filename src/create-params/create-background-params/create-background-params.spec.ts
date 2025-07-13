import { createBackgroundParams } from "./create-background-params";

describe("createBackgroundParams", () => {
  it("should resolve 25 tile width by default", () => {
    const options = createBackgroundParams({});

    expect(options.tileWidth).toBe(25);
  });

  it("should resolve specified tile width", () => {
    const options = createBackgroundParams({ tileDimensions: { width: 10 } });

    expect(options.tileWidth).toBe(10);
  });

  it("should resolve 25 tile height by default", () => {
    const options = createBackgroundParams({});

    expect(options.tileHeight).toBe(25);
  });

  it("should resolve specified tile height", () => {
    const options = createBackgroundParams({ tileDimensions: { height: 10 } });

    expect(options.tileHeight).toBe(10);
  });

  it("should resolve 10 max viewport scale by default", () => {
    const options = createBackgroundParams({});

    expect(options.maxViewportScale).toBe(10);
  });

  it("should resolve specified max viewport scale", () => {
    const options = createBackgroundParams({ maxViewportScale: 15 });

    expect(options.maxViewportScale).toBe(15);
  });

  it("should resolve circle renderer by default", () => {
    const options = createBackgroundParams({});

    expect(options.renderer.tagName).toBe("circle");
  });

  it("should resolve specified renderer by default", () => {
    const options = createBackgroundParams({ renderer: { radius: 5 } });

    expect(options.renderer.getAttribute("r")).toBe("5");
  });
});
