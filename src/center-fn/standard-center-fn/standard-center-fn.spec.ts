import { standardCenterFn } from "./standard-center-fn";

describe("standardCenterFn", () => {
  it("should return middle of rectangle", () => {
    expect(standardCenterFn(10, 20)).toEqual({ x: 5, y: 10 });
  });
});
