import type { HomeAssistant, PreviewDependencies } from "./types";

/** Wait this long after the last state change before composing again. */
export const STATE_REFRESH_DELAY_MS = 500;
/** A template that reads the clock is at most a minute out of date. */
export const CLOCK_REFRESH_MS = 60_000;

type States = NonNullable<HomeAssistant["states"]>;

const domainOf = (entityId: string): string => entityId.split(".", 1)[0] ?? "";

/** Home Assistant replaces an entity's state object whenever it changes. */
const changedEntities = (previous: States, next: States): string[] =>
  [...new Set([...Object.keys(previous), ...Object.keys(next)])].filter(
    (entityId) => previous[entityId] !== next[entityId]
  );

/**
 * Whether the states that changed between two `hass` objects are ones the rendered
 * expressions read, so the preview is out of date.
 */
export const dependenciesChanged = (
  dependencies: PreviewDependencies,
  previous: HomeAssistant["states"],
  next: HomeAssistant["states"]
): boolean => {
  if (!previous || !next || previous === next) return false;
  const changed = changedEntities(previous, next);
  if (dependencies.allStates) return changed.length > 0;
  return changed.some(
    (entityId) =>
      dependencies.entities.includes(entityId) ||
      dependencies.domains.includes(domainOf(entityId))
  );
};
