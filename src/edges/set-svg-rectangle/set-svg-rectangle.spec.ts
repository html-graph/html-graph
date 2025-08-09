import { setSvgRectangle } from "./set-svg-rectangle";

describe("setSvgRectangle", () => {
  it("should set svg transform", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setSvgRectangle(svg, { x: 10, y: 20, width: 100, height: 200 });

    expect(svg.style.transform).toBe("translate(10px, 20px)");
  });

  it("should set svg width", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setSvgRectangle(svg, { x: 10, y: 20, width: 100, height: 200 });

    expect(svg.style.width).toBe("100px");
  });

  it("should set svg height", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setSvgRectangle(svg, { x: 10, y: 20, width: 100, height: 200 });

    expect(svg.style.height).toBe("200px");
  });

  it("should set svg width to at least 1px", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setSvgRectangle(svg, { x: 10, y: 20, width: 0, height: 200 });

    expect(svg.style.width).toBe("1px");
  });

  it("should set svg height to at least 1px", () => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    setSvgRectangle(svg, { x: 10, y: 20, width: 100, height: 0 });

    expect(svg.style.height).toBe("1px");
  });
});
