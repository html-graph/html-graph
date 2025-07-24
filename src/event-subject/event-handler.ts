export interface EventHandler<T> {
  subscribe(callback: (payload: T) => void): void;

  unsubscribe(callback: (payload: T) => void): void;
}
