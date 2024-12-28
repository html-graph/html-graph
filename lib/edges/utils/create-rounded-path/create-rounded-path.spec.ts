import { createRoundedPath } from "./create-rounded-path";

describe("createRoundedPath", () => {
  it("should return empty string for empty array", () => {
    const res = createRoundedPath([]);

    expect(res).toEqual("");
  });
});
