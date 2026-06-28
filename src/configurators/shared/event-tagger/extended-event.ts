import type { tagsFieldName } from "./tags-field-name";

export type ExtendedEvent = Event & {
  [tagsFieldName]: Set<unknown> | undefined;
};
