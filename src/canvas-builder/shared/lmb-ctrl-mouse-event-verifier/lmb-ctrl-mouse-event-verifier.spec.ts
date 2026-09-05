import { describe, expect, it } from "vitest";
import { lmbCtrlMouseEventVerifier } from "./lmb-ctrl-mouse-event-verifier";

describe("lmbCtrlMouseDownEventVerifier", () => {
  it("should pass pass for 0 button and ctrl key", () => {
    expect(
      lmbCtrlMouseEventVerifier(
        new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
      ),
    ).toBe(true);
  });

  it("should not pass when mouse one button pressed", () => {
    expect(
      lmbCtrlMouseEventVerifier(new MouseEvent("mousedown", { button: 1 })),
    ).toBe(false);
  });

  it("should not pass when ctrl key not pressed", () => {
    expect(
      lmbCtrlMouseEventVerifier(
        new MouseEvent("mousedown", { button: 1, ctrlKey: true }),
      ),
    ).toBe(false);
  });
});
