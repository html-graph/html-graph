export interface QueueEntry<T> {
  readonly value: T;
  previous: QueueEntry<T> | null;
  next: QueueEntry<T> | null;
}
