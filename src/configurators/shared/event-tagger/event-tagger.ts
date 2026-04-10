import { ExtendedEvent } from "./extended-event";

export class EventTagger {
  private readonly field = "_htmlGraphTags";

  public has(event: Event, tag: unknown): boolean {
    const e = event as ExtendedEvent;
    const tags = e[this.field];

    return tags !== undefined && tags.has(tag);
  }

  public tag(event: Event, tag: unknown): void {
    const e = event as ExtendedEvent;
    const tags = e[this.field];

    if (tags === undefined) {
      e[this.field] = new Set<unknown>([tag]);
    } else {
      tags.add(tag);
    }
  }
}
