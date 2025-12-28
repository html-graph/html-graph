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

  it("should set child node for parent node", () => {
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

  it("should set parent node for child node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    child.setParent("child-1", parent);

    expect(child.getParent()).toBe(parent);
  });

  it("should set parents's child node for child node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    child.setParent("child-1", parent);
    const children = parent.getChildren();

    expect(children).toEqual(new Map([["child-1", child]]));
  });

  it("should set child's parent node for parent node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    parent.setChild("child-1", child);
    const childParent = child.getParent();

    expect(childParent).toBe(parent);
  });

  it("should unset child's parent node for child node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    child.setParent("child-1", parent);
    child.unsetParent("child-1");
    const childParent = child.getParent();

    expect(childParent).toBe(null);
  });

  it("should unset parents's child node for parent node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    parent.setChild("child-1", child);
    parent.unsetChild("child-1");
    const children = parent.getChildren();

    expect(children).toEqual(new Map());
  });

  it("should unset parents's child node for child node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    parent.setChild("child-1", child);
    child.unsetParent("child-1");
    const children = parent.getChildren();

    expect(children).toEqual(new Map());
  });

  it("should unset child's parent node for parent node", () => {
    const parent = new TreeMapNode<string, object>({});
    const child = new TreeMapNode<string, object>({});

    parent.setChild("child-1", child);
    parent.unsetChild("child-1");
    const childParent = child.getParent();

    expect(childParent).toBe(null);
  });
});
