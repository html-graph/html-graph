import { createConfig } from "./create-config";

describe("createConfig", () => {
  it("should resolve 25 tile width by default", () => {
    const options = createConfig({});

    expect(options.tileWidth).toBe(25);
  });

  it("should resolve specified tile width", () => {
    const options = createConfig({ tileDimensions: { width: 10 } });

    expect(options.tileWidth).toBe(10);
  });

  it("should resolve 25 tile height by default", () => {
    const options = createConfig({});

    expect(options.tileHeight).toBe(25);
  });

  it("should resolve specified tile height", () => {
    const options = createConfig({ tileDimensions: { height: 10 } });

    expect(options.tileHeight).toBe(10);
  });

  it("should resolve 10 max viewport scale by default", () => {
    const options = createConfig({});

    expect(options.maxViewportScale).toBe(10);
  });

  it("should resolve specified max viewport scale", () => {
    const options = createConfig({ maxViewportScale: 15 });

    expect(options.maxViewportScale).toBe(15);
  });

  it("should resolve circle renderer by default", () => {
    const options = createConfig({});

    expect(options.renderer.tagName).toBe("circle");
  });

  it("should resolve specified renderer by default", () => {
    const options = createConfig({ renderer: { radius: 5 } });

    expect(options.renderer.getAttribute("r")).toBe("5");
  });
});
