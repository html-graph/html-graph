import { isPointOnWindow } from "./is-point-on-window";

let windowSpy: jest.SpyInstance;

beforeEach(() => {
  windowSpy = jest.spyOn(globalThis, "window", "get");

  windowSpy.mockImplementation(() => ({
    innerWidth: 1000,
    innerHeight: 500,
  }));
});

afterEach(() => {
  windowSpy.mockRestore();
});

describe("isPointOnWindow", () => {
  it("should return true when for point inside window", () => {
    expect(isPointOnWindow(window, 1, 1)).toBe(true);
  });

  it("should return false for negative x", () => {
    expect(isPointOnWindow(window, -1, 0)).toBe(false);
  });

  it("should return false for negative y", () => {
    expect(isPointOnWindow(window, 0, -1)).toBe(false);
  });

  it("should return false when x is more than window width", () => {
    expect(isPointOnWindow(window, 1001, 0)).toBe(false);
  });

  it("should return false when y is more than window height", () => {
    expect(isPointOnWindow(window, 0, 501)).toBe(false);
  });

  it("should return true when point x is on the lower border", () => {
    expect(isPointOnWindow(window, 0, 1)).toBe(true);
  });

  it("should return true when point x is on the upper border", () => {
    expect(isPointOnWindow(window, 1000, 1)).toBe(true);
  });

  it("should return true when point y is on the lower border", () => {
    expect(isPointOnWindow(window, 1, 0)).toBe(true);
  });

  it("should return true when point y is on the upper border", () => {
    expect(isPointOnWindow(window, 1, 500)).toBe(true);
  });
});
