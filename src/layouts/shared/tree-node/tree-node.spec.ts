import { TreeNode } from "./tree-node";

describe("TreeNode", () => {
  it("should create node with specified id", () => {
    const node = new TreeNode<string>("node-1");

    expect(node.payload).toBe("node-1");
  });

  it("should create node with 0 children", () => {
    const node = new TreeNode<string>("node-1");

    const children = node.getChildren();

    expect(children).toEqual(new Set([]));
  });

  it("should add child node", () => {
    const parent = new TreeNode<string>("node-1");
    const child = new TreeNode<string>("node-2");
    parent.addChild(child);

    const children = parent.getChildren();

    expect(children).toEqual(new Set([child]));
  });

  it("should set null as parent node by default", () => {
    const node = new TreeNode<string>("node-1");

    expect(node.getParent()).toBe(null);
  });

  it("should child's parent node", () => {
    const parent = new TreeNode<string>("node-1");
    const child = new TreeNode<string>("node-2");
    parent.addChild(child);

    expect(child.getParent()).toBe(parent);
  });
});
