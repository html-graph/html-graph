export class OneToManyCollection<S, M> {
  private readonly singleToMultiMap = new Map<S, Set<M>>();

  private readonly multiToSingleMap = new Map<M, S>();

  public addRecord(single: S, multi: M): void {
    const multiValue = this.singleToMultiMap.get(single);

    if (multiValue === undefined) {
      this.singleToMultiMap.set(single, new Set([multi]));
    } else {
      multiValue.add(multi);
    }

    this.multiToSingleMap.set(multi, single);
  }

  public getFirstBySingle(single: S): M | undefined {
    const set = this.singleToMultiMap.get(single);

    if (set === undefined) {
      return undefined;
    }

    const first = Array.from(set.values())[0];

    return first;
  }

  public removeByMulti(multi: M): void {
    const single = this.multiToSingleMap.get(multi)!;
    const set = this.singleToMultiMap.get(single)!;

    set.delete(multi);

    if (set.size === 0) {
      this.singleToMultiMap.delete(single);
    }

    this.multiToSingleMap.delete(multi);
  }

  public getByMulti(multi: M): S | undefined {
    return this.multiToSingleMap.get(multi);
  }

  public removeBySingle(single: S): void {
    const set = this.singleToMultiMap.get(single)!;

    set.forEach((multi) => {
      this.multiToSingleMap.delete(multi);
    });

    this.singleToMultiMap.delete(single);
  }

  public clear(): void {
    this.singleToMultiMap.clear();
    this.multiToSingleMap.clear();
  }

  public forEachSingle(callback: (single: S) => void): void {
    this.singleToMultiMap.forEach((_multi, single) => {
      callback(single);
    });
  }

  public hasSingle(single: S): boolean {
    return this.singleToMultiMap.get(single) !== undefined;
  }

  public hasMulti(multi: M): boolean {
    return this.multiToSingleMap.get(multi) !== undefined;
  }
}
