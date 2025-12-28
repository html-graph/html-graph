import { TreeMapNode } from "./tree-map-node";

describe("TreeNode", () => {
  it("should create node with specified payload", () => {
    const payload = {};
    const node = new TreeMapNode<string, object>(payload);

    expect(node.payload).toBe(payload);
  });

  it("should create node with 0 children", () => {
    const node = new TreeMapNode<string, object>({});

    const children = node.getChildren();

    expect(children).toEqual(new Map([]));
  });

  it("should add child node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    parent.setChild("child-1", child);

    const children = parent.getChildren();

    expect(children).toEqual(new Map([["child-1", child]]));
  });

  it("should set null as parent node by default", () => {
    const node = new TreeMapNode<string, object>({});

    expect(node.getParent()).toBe(null);
  });

  it("should child's parent node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});
    parent.setChild("child-1", child);

    expect(child.getParent()).toBe(parent);
  });
});
