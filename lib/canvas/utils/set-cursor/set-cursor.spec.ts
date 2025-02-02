import { setCursor } from "./set-cursor";

describe("setCursor", () => {
  it("should set cursor to specified value", () => {
    const element = document.createElement("div");

    setCursor(element, "crosshair");

    expect(element.style.cursor).toBe("crosshair");
  });

  it("should unset cursor", () => {
    const element = document.createElement("div");

    setCursor(element, "crosshair");
    setCursor(element, null);

    expect(element.style.cursor).toBe("");
  });
});
