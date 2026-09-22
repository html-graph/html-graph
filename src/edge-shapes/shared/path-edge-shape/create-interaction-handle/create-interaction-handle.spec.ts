import { describe, expect, it } from "vitest";
import { createInteractionHandle } from "./create-interaction-handle";

describe("createInteractionHandle", () => {
  it("should create edge group with pointer events set to auto", () => {
    const group = createInteractionHandle();

    expect(group.style.pointerEvents).toBe("auto");
  });

  it("should create edge group with cursor pointer", () => {
    const group = createInteractionHandle();

    expect(group.style.cursor).toBe("pointer");
  });
});
