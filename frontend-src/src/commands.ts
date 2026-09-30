import { strings } from "./strings";
import type { StudioItem } from "./types";

/**
 * Every action a user can take, defined once. Buttons, the keyboard handler and
 * (later) context menus all read their label, icon, shortcut and availability from
 * here, so nothing is implemented, or described, twice.
 */

export type CommandId =
  "undo" | "redo" | "delete-item" | "toggle-hidden" | "toggle-locked";

export type ItemFlag = "locked" | "hidden";

/** What decides whether a command can run and how it is described. */
export interface CommandContext {
  canUndo: boolean;
  canRedo: boolean;
  /** The item the command is about: the selection, or the row whose button was used. */
  item?: StudioItem;
}

/** The effects a command can have; the shell provides them. */
export interface CommandActions {
  undo(): void;
  redo(): void;
  requestDelete(itemId: string): void;
  toggleFlag(itemId: string, flag: ItemFlag): void;
}

/** A key combination. `mod` is Ctrl, or ⌘ on a Mac. */
export interface Shortcut {
  key: string;
  mod?: boolean;
  shift?: boolean;
}

export interface Command {
  id: CommandId;
  /** The verb shown on a button or menu item. */
  label(context: CommandContext): string;
  icon(context: CommandContext): string;
  /** The first one is shown in tooltips. */
  shortcuts: Shortcut[];
  isEnabled(context: CommandContext): boolean;
  run(context: CommandContext, actions: CommandActions): void;
}

/** The part of a keyboard event the shortcuts look at. */
export interface KeyInput {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/** Context for a command about one item, outside the undo history. */
export const itemContext = (item: StudioItem): CommandContext => ({
  canUndo: false,
  canRedo: false,
  item,
});

const hasItem = (context: CommandContext): boolean =>
  context.item !== undefined;

export const COMMANDS: Command[] = [
  {
    id: "undo",
    label: () => strings.commands.undo,
    icon: () => "mdi:undo",
    shortcuts: [{ key: "z", mod: true }],
    isEnabled: (context) => context.canUndo,
    run: (_context, actions) => actions.undo(),
  },
  {
    id: "redo",
    label: () => strings.commands.redo,
    icon: () => "mdi:redo",
    shortcuts: [
      { key: "z", mod: true, shift: true },
      { key: "y", mod: true },
    ],
    isEnabled: (context) => context.canRedo,
    run: (_context, actions) => actions.redo(),
  },
  {
    id: "delete-item",
    label: () => strings.commands.delete,
    icon: () => "mdi:delete-outline",
    shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
    isEnabled: hasItem,
    run: ({ item }, actions) => {
      if (item) {
        actions.requestDelete(item.id);
      }
    },
  },
  {
    id: "toggle-hidden",
    label: ({ item }) =>
      item?.hidden ? strings.commands.show : strings.commands.hide,
    icon: ({ item }) =>
      item?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
    shortcuts: [],
    isEnabled: hasItem,
    run: ({ item }, actions) => {
      if (item) {
        actions.toggleFlag(item.id, "hidden");
      }
    },
  },
  {
    id: "toggle-locked",
    label: ({ item }) =>
      item?.locked ? strings.commands.unlock : strings.commands.lock,
    icon: ({ item }) =>
      item?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
    shortcuts: [],
    isEnabled: hasItem,
    run: ({ item }, actions) => {
      if (item) {
        actions.toggleFlag(item.id, "locked");
      }
    },
  },
];

export const commandById = (id: CommandId): Command => {
  const command = COMMANDS.find((candidate) => candidate.id === id);
  if (!command) {
    throw new Error(`Unknown command ${id}`);
  }
  return command;
};

const matches = (shortcut: Shortcut, input: KeyInput): boolean => {
  const mod = input.ctrlKey || input.metaKey;
  return (
    input.key.toLowerCase() === shortcut.key.toLowerCase() &&
    mod === Boolean(shortcut.mod) &&
    input.shiftKey === Boolean(shortcut.shift) &&
    !input.altKey
  );
};

/** The command a key press stands for, if any. */
export const commandForKey = (input: KeyInput): Command | undefined =>
  COMMANDS.find((command) =>
    command.shortcuts.some((shortcut) => matches(shortcut, input))
  );

const KEY_NAMES: Record<string, string> = { Delete: "Del", Backspace: "⌫" };

/** A shortcut as the platform writes it: `Ctrl+Shift+Z`, or `⌘⇧Z` on a Mac. */
export const formatShortcut = (shortcut: Shortcut, mac: boolean): string => {
  const key = KEY_NAMES[shortcut.key] ?? shortcut.key.toUpperCase();
  if (mac) {
    return `${shortcut.mod ? "⌘" : ""}${shortcut.shift ? "⇧" : ""}${key}`;
  }
  const parts = [
    shortcut.mod ? "Ctrl" : "",
    shortcut.shift ? "Shift" : "",
    key,
  ].filter(Boolean);
  return parts.join("+");
};

/** How a command looks right now, ready for a button. */
export interface CommandView {
  label: string;
  icon: string;
  /** The label, with the first shortcut when there is one. */
  title: string;
  enabled: boolean;
}

export const commandView = (
  command: Command,
  context: CommandContext,
  mac = false
): CommandView => {
  const label = command.label(context);
  const [shortcut] = command.shortcuts;
  return {
    label,
    icon: command.icon(context),
    title: shortcut ? `${label} (${formatShortcut(shortcut, mac)})` : label,
    enabled: command.isEnabled(context),
  };
};
