import { describe, expect, it } from "vitest";
import { defaultPortIdResolver } from "./default-port-id-resolver";

describe("defaultPortIdResolver", () => {
  it("should return null when specified aray is empty", () => {
    expect(defaultPortIdResolver([])).toBe(null);
  });

  it("should return first port when array is not empty", () => {
    expect(defaultPortIdResolver([123])).toBe(123);
  });
});
