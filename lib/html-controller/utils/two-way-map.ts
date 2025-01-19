export class TwoWayMap<A, B> {
  private readonly keyMap = new Map<A, B>();

  private readonly valueMap = new Map<B, A>();

  public set(key: A, value: B): void {
    this.keyMap.set(key, value);
    this.valueMap.set(value, key);
  }

  public getByKey(key: A): B | undefined {
    return this.keyMap.get(key);
  }

  public getByValue(value: B): A | undefined {
    return this.valueMap.get(value);
  }

  public deleteByKey(key: A): void {
    const value = this.keyMap.get(key);

    if (value !== undefined) {
      this.valueMap.delete(value);
    }

    this.keyMap.delete(key);
  }

  public deleteByValue(value: B): void {
    const key = this.valueMap.get(value);

    if (key !== undefined) {
      this.keyMap.delete(key);
    }

    this.valueMap.delete(value);
  }

  public forEach(callback: (value: B, key: A) => void): void {
    this.keyMap.forEach((v, k) => {
      callback(v, k);
    });
  }

  public clear(): void {
    this.keyMap.clear();
    this.valueMap.clear();
  }
}
