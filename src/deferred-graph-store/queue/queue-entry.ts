export interface QueueEntry<T> {
  readonly value: T;
  readonly previous: QueueEntry<T>;
}
