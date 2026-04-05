import {
  adjacentNextLayerNodesResolver,
  incomingNextLayerNodesResolver,
  NextLayerNodesResolver,
  outgoingNextLayerNodesResolver,
} from "@/layouts";
import { resolveNextLayerNodesResolver } from "./resolve-next-layer-nodes-resolver";

describe("resolveNextlayerNodesResolver", () => {
  it("should resolve specified resolver", () => {
    const resolver: NextLayerNodesResolver = () => [];

    expect(resolveNextLayerNodesResolver(resolver)).toBe(resolver);
  });

  it("should resolve adjacent resolver", () => {
    expect(resolveNextLayerNodesResolver("adjacent")).toBe(
      adjacentNextLayerNodesResolver,
    );
  });

  it("should resolve outgoing resolver", () => {
    expect(resolveNextLayerNodesResolver("outgoing")).toBe(
      outgoingNextLayerNodesResolver,
    );
  });

  it("should resolve incoming resolver", () => {
    expect(resolveNextLayerNodesResolver("incoming")).toBe(
      incomingNextLayerNodesResolver,
    );
  });
});
