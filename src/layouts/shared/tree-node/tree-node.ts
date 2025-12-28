export class TreeNode<T> {
  private readonly children = new Set<TreeNode<T>>();

  private parent: TreeNode<T> | null = null;

  public constructor(public readonly payload: T) {}

  public addChild(child: TreeNode<T>): void {
    this.children.add(child);
    child.setParent(this);
  }

  public setParent(parent: TreeNode<T>): void {
    this.parent = parent;
  }

  public getParent(): TreeNode<T> | null {
    return this.parent;
  }

  public getChildren(): ReadonlySet<TreeNode<T>> {
    return this.children;
  }
}
