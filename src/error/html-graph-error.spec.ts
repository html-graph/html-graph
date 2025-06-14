import { HtmlGraphError } from "./html-graph-error";

describe("HtmlGraphError", () => {
  it("should have name HtmlGraphError", () => {
    const error = new HtmlGraphError();

    expect(error.name).toBe("HtmlGraphError");
  });

  it("should have specified error message", () => {
    const error = new HtmlGraphError("error message");

    expect(error.message).toBe("error message");
  });
});
