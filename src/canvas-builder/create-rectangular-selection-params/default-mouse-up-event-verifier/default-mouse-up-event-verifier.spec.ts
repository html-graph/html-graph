import { describe, expect, it } from "vitest";
import { defaultMouseUpEventVerifier } from "./default-mouse-up-event-verifier";

describe("defaultMouseUpEventVerifier", () => {
  it("should pass pass for 0 button", () => {
    expect(
      defaultMouseUpEventVerifier(new MouseEvent("mouseup", { button: 0 })),
    ).toBe(true);
  });

  it("should not pass when mouse one button pressed", () => {
    expect(
      defaultMouseUpEventVerifier(new MouseEvent("mouseup", { button: 1 })),
    ).toBe(false);
  });
});
