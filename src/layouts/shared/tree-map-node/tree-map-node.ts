export class TreeMapNode<K, P> {
  private readonly children = new Map<K, TreeMapNode<K, P>>();

  private parent: TreeMapNode<K, P> | null = null;

  public constructor(public readonly payload: P) {}

  public getChildren(): ReadonlyMap<K, TreeMapNode<K, P>> {
    return this.children;
  }

  public setChild(key: K, child: TreeMapNode<K, P>): void {
    this.children.set(key, child);
  }

  public getParent(): TreeMapNode<K, P> | null {
    return this.parent;
  }
}
