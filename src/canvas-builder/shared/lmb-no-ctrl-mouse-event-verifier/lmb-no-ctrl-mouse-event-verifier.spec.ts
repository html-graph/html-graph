import { describe, expect, it } from "vitest";
import { lmbNoCtrlMouseEventVerifier } from "./lmb-no-ctrl-mouse-event-verifier";

describe("lmbNoCtrlMouseEventVerifier", () => {
  it("should pass pass when lmb button pressed and ctrl key not pressed", () => {
    expect(
      lmbNoCtrlMouseEventVerifier(
        new MouseEvent("mousedown", { button: 0, ctrlKey: false }),
      ),
    ).toBe(true);
  });

  it("should not pass when middle mouse button pressed", () => {
    expect(
      lmbNoCtrlMouseEventVerifier(new MouseEvent("mousedown", { button: 1 })),
    ).toBe(false);
  });

  it("should not pass when lmb pressed and ctrl pressed", () => {
    expect(
      lmbNoCtrlMouseEventVerifier(
        new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
      ),
    ).toBe(false);
  });
});
