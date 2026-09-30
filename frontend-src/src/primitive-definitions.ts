import { parse } from "yaml";
import type { PrimitiveDefinition } from "./types";

/**
 * The backend's `primitives/<type>.yml` files, read straight from the repository.
 * The dev harness and the unit tests use these instead of a copy, so the panel is
 * always tested against the definitions the backend really ships.
 */
const files = import.meta.glob(
  "../../custom_components/opendisplay_studio/primitives/*.yml",
  { query: "?raw", import: "default", eager: true }
);

export const loadPrimitiveDefinitions = (): PrimitiveDefinition[] =>
  Object.values(files)
    .map((text) => parse(String(text)) as PrimitiveDefinition)
    .sort((left, right) => left.order - right.order);
