import { ExtendedEvent } from "./extended-event";
import { tagsFieldName } from "./tags-field-name";

export class EventTagger {
  public has(event: Event, tag: unknown): boolean {
    const e = event as ExtendedEvent;
    const tags = e[tagsFieldName];

    return tags !== undefined && tags.has(tag);
  }

  public tag(event: Event, tag: unknown): void {
    const e = event as ExtendedEvent;
    const tags = e[tagsFieldName];

    if (tags === undefined) {
      e[tagsFieldName] = new Set<unknown>([tag]);
    } else {
      tags.add(tag);
    }
  }
}
