export class TreeMapNode<K, P> {
  private parent: TreeMapNode<K, P> | null = null;

  private readonly children = new Map<K, TreeMapNode<K, P>>();

  public constructor(public readonly payload: P) {}

  public getParent(): TreeMapNode<K, P> | null {
    return this.parent;
  }

  public getChildren(): ReadonlyMap<K, TreeMapNode<K, P>> {
    return this.children;
  }

  public setChild(key: K, node: TreeMapNode<K, P>): void {
    if (this.children.get(key) !== node) {
      this.children.set(key, node);
      node.setParent(key, this);
    }
  }

  public unsetChild(key: K): void {
    this.children.delete(key);
  }

  public setParent(key: K, node: TreeMapNode<K, P>): void {
    if (this.parent !== node) {
      this.parent = node;
      this.parent.setChild(key, this);
    }
  }

  public unsetParent(): void {
    this.parent = null;
  }
}
