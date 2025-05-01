/**
 * Responsibility: Provides a way to handle events
 */
export interface EventHandler<T> {
  subscribe(callback: (payload: T) => void): void;

  unsubscribe(callback: (payload: T) => void): void;
}
