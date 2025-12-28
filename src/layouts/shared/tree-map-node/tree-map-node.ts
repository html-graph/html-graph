export class TreeMapNode<K, P> {
  private readonly children = new Map<K, TreeMapNode<K, P>>();

  private parent: TreeMapNode<K, P> | null = null;

  public constructor(public readonly payload: P) {}

  public getChildren(): ReadonlyMap<K, TreeMapNode<K, P>> {
    return this.children;
  }

  public setChild(key: K, child: TreeMapNode<K, P>): void {
    this.children.set(key, child);

    if (child.getParent() !== this) {
      child.setParent(key, this);
    }
  }

  public setParent(key: K, parent: TreeMapNode<K, P>): void {
    this.parent = parent;
    this.parent.setChild(key, this);
  }

  public unsetParent(key: K): void {
    const parent = this.parent;
    this.parent = null;

    if (parent !== null) {
      parent.unsetChild(key);
    }
  }

  public unsetChild(key: K): void {
    const child = this.children.get(key)!;

    if (child.getParent() === this) {
      child.unsetParent(key);
    }

    this.children.delete(key);
  }

  public getParent(): TreeMapNode<K, P> | null {
    return this.parent;
  }
}
