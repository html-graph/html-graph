import { describe, expect, it } from "vitest";
import { defaultMouseDownEventVerifier } from "./default-mouse-down-event-verifier";

describe("defaultMouseDownEventVerifier", () => {
  it("should pass pass for 0 button and ctrl key", () => {
    expect(
      defaultMouseDownEventVerifier(
        new MouseEvent("mousedown", { button: 0, ctrlKey: true }),
      ),
    ).toBe(true);
  });

  it("should not pass when mouse one button pressed", () => {
    expect(
      defaultMouseDownEventVerifier(new MouseEvent("mousedown", { button: 1 })),
    ).toBe(false);
  });

  it("should not pass when ctrl key not pressed", () => {
    expect(
      defaultMouseDownEventVerifier(
        new MouseEvent("mousedown", { button: 1, ctrlKey: true }),
      ),
    ).toBe(false);
  });
});
