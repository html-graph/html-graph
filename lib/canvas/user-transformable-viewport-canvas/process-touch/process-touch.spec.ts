import { processTouch } from "./process-touch";

const touch1: Touch = {
  clientX: 10,
  clientY: 20,
  force: 0,
  identifier: 0,
  pageX: 0,
  pageY: 0,
  radiusX: 0,
  radiusY: 0,
  rotationAngle: 0,
  screenX: 0,
  screenY: 0,
  target: document.createElement("div"),
};

const touch2: Touch = {
  clientX: 20,
  clientY: 40,
  force: 0,
  identifier: 0,
  pageX: 0,
  pageY: 0,
  radiusX: 0,
  radiusY: 0,
  rotationAngle: 0,
  screenX: 0,
  screenY: 0,
  target: document.createElement("div"),
};

describe("processTouch", () => {
  it("should return correct x for one touch", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1],
    });

    const res = processTouch(event);

    expect(res.x).toBe(10);
  });

  it("should return correct y for one touch", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1],
    });

    const res = processTouch(event);

    expect(res.y).toBe(20);
  });

  it("should return correct x for two touches", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1, touch2],
    });

    const res = processTouch(event);

    expect(res.x).toBe(15);
  });

  it("should return correct y for two touches", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1, touch2],
    });

    const res = processTouch(event);

    expect(res.y).toBe(30);
  });

  it("should return correct touches number", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1, touch2],
    });

    const res = processTouch(event);

    expect(res.touchesCnt).toBe(2);
  });

  it("should return correct distance", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1, touch2],
    });

    const res = processTouch(event);

    const expectedScale = Math.sqrt(10 * 10 + 20 * 20) / 2;
    expect(res.scale).toBe(expectedScale);
  });

  it("should return correct touches array", () => {
    const event = new TouchEvent("touchstart", {
      touches: [touch1],
    });

    const res = processTouch(event);

    expect(res.touches).toStrictEqual([[10, 20]]);
  });
});
