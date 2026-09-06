import { describe, expect, it } from "vitest";
import { lmbMouseEventVerifier } from "./lmb-mouse-event-verifier";

describe("lmbMouseEventVerifier", () => {
  it("should pass pass for 0 button", () => {
    expect(
      lmbMouseEventVerifier(new MouseEvent("mouseup", { button: 0 })),
    ).toBe(true);
  });

  it("should not pass when mouse one button pressed", () => {
    expect(
      lmbMouseEventVerifier(new MouseEvent("mouseup", { button: 1 })),
    ).toBe(false);
  });
});
