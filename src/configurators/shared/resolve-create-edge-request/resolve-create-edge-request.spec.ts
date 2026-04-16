import { resolveCreateEdgeRequest } from "./resolve-create-edge-request";

describe("resolveCreateEdgeRequest", () => {
  it("should resolve direct edge", () => {
    const result = resolveCreateEdgeRequest(
      { staticPortId: "port-1", isDirect: true },
      "port-2",
    );

    expect(result).toEqual({ from: "port-1", to: "port-2" });
  });

  it("should resolve reverse edge", () => {
    const result = resolveCreateEdgeRequest(
      { staticPortId: "port-1", isDirect: false },
      "port-2",
    );

    expect(result).toEqual({ from: "port-2", to: "port-1" });
  });
});
