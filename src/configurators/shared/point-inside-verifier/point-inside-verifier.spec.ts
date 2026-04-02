import { createElement } from "@/mocks";
import { PointInsideVerifier } from "./point-inside-verifier";

let innerWidth: number;
let innerHeight: number;

describe("PointInsideVerifier", () => {
  beforeEach(() => {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    window.innerWidth = 100;
    window.innerHeight = 100;
  });

  afterEach(() => {
    window.innerWidth = innerWidth;
    window.innerHeight = innerHeight;
  });

  it("should return true when point is inside window and element", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });
    const verifier = new PointInsideVerifier(element, window);

    expect(verifier.verify(20, 20)).toBe(true);
  });

  it("should return false when point is outside element", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });
    const verifier = new PointInsideVerifier(element, window);

    expect(verifier.verify(5, 5)).toBe(false);
  });

  it("should return false when point is outside window", () => {
    const element = createElement({ x: 10, y: 10, width: 100, height: 100 });
    const verifier = new PointInsideVerifier(element, window);

    expect(verifier.verify(105, 105)).toBe(false);
  });
});
