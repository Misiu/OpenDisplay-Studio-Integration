import { strings } from "./strings";
import type { StudioItem } from "./types";

/**
 * Every action a user can take, defined once. Buttons, the keyboard handler, context
 * menus and the shortcuts dialog all read their label, icon, shortcut and availability
 * from here, so nothing is implemented, or described, twice.
 */

type Direction = "left" | "right" | "up" | "down";

export type CommandId =
  | "undo"
  | "redo"
  | "delete-item"
  | "toggle-hidden"
  | "toggle-locked"
  | "group"
  | "ungroup"
  | "enter-group"
  | "exit-group"
  | "deselect"
  | "copy"
  | "cut"
  | "paste"
  | "paste-here"
  | "duplicate"
  | "bring-to-front"
  | "send-to-back"
  | "move-up"
  | "move-down"
  | "rename"
  | "save"
  | "toggle-code"
  | "zoom-in"
  | "zoom-out"
  | "zoom-reset"
  | "show-shortcuts"
  | `nudge-${Direction}`
  | `nudge-${Direction}-snap`;

export type ItemFlag = "locked" | "hidden";

/** What decides whether a command can run and how it is described. */
export interface CommandContext {
  canUndo: boolean;
  canRedo: boolean;
  /** The item the command is about: the selection, or the row whose button was used. */
  item?: StudioItem;
  /** Everything the command acts on: the whole selection, or just the row's item. */
  targets?: StudioItem[];
  /** Whether `Make group` / `Ungroup` apply to the targets, decided by the shell. */
  canGroup?: boolean;
  canUngroup?: boolean;
  /** Whether the item is a group that can be entered, and whether one is entered now. */
  canEnter?: boolean;
  entered?: boolean;
  /** Whether something is on the clipboard. */
  canPaste?: boolean;
  /** Whether the dashboard has unsaved changes. */
  dirty?: boolean;
}

/** The effects a command can have; the shell provides them. */
export interface CommandActions {
  undo(): void;
  redo(): void;
  requestDelete(itemIds: string[]): void;
  toggleFlag(itemIds: string[], flag: ItemFlag): void;
  group(itemIds: string[]): void;
  ungroup(itemId: string): void;
  enterGroup(itemId: string): void;
  exitGroup(): void;
  deselect(): void;
  copy(itemIds: string[]): void;
  cut(itemIds: string[]): void;
  paste(): void;
  pasteHere(): void;
  duplicate(itemIds: string[]): void;
  arrange(itemIds: string[], how: "front" | "back" | "up" | "down"): void;
  rename(itemId: string): void;
  save(): void;
  toggleCode(): void;
  zoom(how: "in" | "out" | "reset"): void;
  /** Moves the items by one step in a direction; `snapped` steps by the snap size. */
  nudge(itemIds: string[], direction: Direction, snapped: boolean): void;
  showShortcuts(): void;
}

/** A key combination. `mod` is Ctrl, or ⌘ on a Mac. */
export interface Shortcut {
  key: string;
  mod?: boolean;
  shift?: boolean;
}

/** The heading a command has in the shortcuts dialog. */
export type CommandGroup = "edit" | "arrange" | "group" | "view" | "history";

export interface Command {
  id: CommandId;
  group: CommandGroup;
  /** The verb shown on a button or menu item. */
  label(context: CommandContext): string;
  icon(context: CommandContext): string;
  /** The first one is shown in tooltips. */
  shortcuts: Shortcut[];
  isEnabled(context: CommandContext): boolean;
  /** Whether a menu should offer the command at all; defaults to always. */
  isRelevant?(context: CommandContext): boolean;
  /** Whether the shortcut also works in the code view. */
  anywhere?: boolean;
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
  targets: [item],
  canGroup: item.kind === "container" && !item.grouped,
  canUngroup: item.kind === "container" && item.grouped,
  canEnter: item.kind === "container" && item.grouped,
});

const targetsOf = (context: CommandContext): StudioItem[] =>
  context.targets ?? (context.item ? [context.item] : []);

const hasTargets = (context: CommandContext): boolean =>
  targetsOf(context).length > 0;

/** Runs `run` with the ids of the targets, unless there are none. */
const withTargets = (
  context: CommandContext,
  run: (ids: string[]) => void
): void => {
  const ids = targetsOf(context).map((item) => item.id);
  if (ids.length > 0) run(ids);
};

const DIRECTIONS: Record<Direction, { key: string; icon: string }> = {
  left: { key: "ArrowLeft", icon: "mdi:arrow-left" },
  right: { key: "ArrowRight", icon: "mdi:arrow-right" },
  up: { key: "ArrowUp", icon: "mdi:arrow-up" },
  down: { key: "ArrowDown", icon: "mdi:arrow-down" },
};

/** One nudge command per direction and step: 1 px, or the snap size with Shift. */
const nudgeCommands = (): Command[] =>
  (Object.keys(DIRECTIONS) as Direction[]).flatMap((direction) =>
    [false, true].map((snapped): Command => ({
      id: snapped ? `nudge-${direction}-snap` : `nudge-${direction}`,
      group: "arrange",
      label: () => strings.commands.nudge[direction],
      icon: () => DIRECTIONS[direction].icon,
      shortcuts: [{ key: DIRECTIONS[direction].key, shift: snapped }],
      isEnabled: hasTargets,
      isRelevant: () => false,
      run: (context, actions) =>
        withTargets(context, (ids) => actions.nudge(ids, direction, snapped)),
    }))
  );

export const COMMANDS: Command[] = [
  {
    id: "undo",
    group: "history",
    label: () => strings.commands.undo,
    icon: () => "mdi:undo",
    shortcuts: [{ key: "z", mod: true }],
    isEnabled: (context) => context.canUndo,
    run: (_context, actions) => actions.undo(),
  },
  {
    id: "redo",
    group: "history",
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
    group: "edit",
    label: () => strings.commands.delete,
    icon: () => "mdi:delete-outline",
    shortcuts: [{ key: "Delete" }, { key: "Backspace" }],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.requestDelete(ids)),
  },
  {
    id: "toggle-hidden",
    group: "edit",
    label: ({ item }) =>
      item?.hidden ? strings.commands.show : strings.commands.hide,
    icon: ({ item }) =>
      item?.hidden ? "mdi:eye-off-outline" : "mdi:eye-outline",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.toggleFlag(ids, "hidden")),
  },
  {
    id: "toggle-locked",
    group: "edit",
    label: ({ item }) =>
      item?.locked ? strings.commands.unlock : strings.commands.lock,
    icon: ({ item }) =>
      item?.locked ? "mdi:lock" : "mdi:lock-open-variant-outline",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.toggleFlag(ids, "locked")),
  },
  {
    id: "copy",
    group: "edit",
    label: () => strings.commands.copy,
    icon: () => "mdi:content-copy",
    shortcuts: [{ key: "c", mod: true }],
    isEnabled: hasTargets,
    run: (context, actions) => withTargets(context, (ids) => actions.copy(ids)),
  },
  {
    id: "cut",
    group: "edit",
    label: () => strings.commands.cut,
    icon: () => "mdi:content-cut",
    shortcuts: [{ key: "x", mod: true }],
    isEnabled: hasTargets,
    run: (context, actions) => withTargets(context, (ids) => actions.cut(ids)),
  },
  {
    id: "paste",
    group: "edit",
    label: () => strings.commands.paste,
    icon: () => "mdi:content-paste",
    shortcuts: [{ key: "v", mod: true }],
    isEnabled: (context) => Boolean(context.canPaste),
    run: (_context, actions) => actions.paste(),
  },
  {
    id: "paste-here",
    group: "edit",
    label: () => strings.commands.pasteHere,
    icon: () => "mdi:content-paste",
    shortcuts: [],
    isEnabled: (context) => Boolean(context.canPaste),
    run: (_context, actions) => actions.pasteHere(),
  },
  {
    id: "duplicate",
    group: "edit",
    label: () => strings.commands.duplicate,
    icon: () => "mdi:content-duplicate",
    shortcuts: [{ key: "d", mod: true }],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.duplicate(ids)),
  },
  {
    id: "rename",
    group: "edit",
    label: () => strings.commands.rename,
    icon: () => "mdi:pencil-outline",
    shortcuts: [{ key: "F2" }],
    isEnabled: (context) => context.item !== undefined,
    run: ({ item }, actions) => {
      if (item) actions.rename(item.id);
    },
  },
  {
    id: "bring-to-front",
    group: "arrange",
    label: () => strings.commands.bringToFront,
    icon: () => "mdi:arrange-bring-to-front",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.arrange(ids, "front")),
  },
  {
    id: "send-to-back",
    group: "arrange",
    label: () => strings.commands.sendToBack,
    icon: () => "mdi:arrange-send-to-back",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.arrange(ids, "back")),
  },
  {
    id: "move-up",
    group: "arrange",
    label: () => strings.commands.moveUp,
    icon: () => "mdi:arrow-up",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.arrange(ids, "up")),
  },
  {
    id: "move-down",
    group: "arrange",
    label: () => strings.commands.moveDown,
    icon: () => "mdi:arrow-down",
    shortcuts: [],
    isEnabled: hasTargets,
    run: (context, actions) =>
      withTargets(context, (ids) => actions.arrange(ids, "down")),
  },
  ...nudgeCommands(),
  {
    id: "group",
    group: "group",
    label: () => strings.commands.group,
    icon: () => "mdi:group",
    shortcuts: [{ key: "g", mod: true }],
    isEnabled: (context) => Boolean(context.canGroup),
    isRelevant: (context) => Boolean(context.canGroup),
    run: (context, actions) =>
      withTargets(context, (ids) => actions.group(ids)),
  },
  {
    id: "ungroup",
    group: "group",
    label: () => strings.commands.ungroup,
    icon: () => "mdi:ungroup",
    shortcuts: [{ key: "g", mod: true, shift: true }],
    isEnabled: (context) => Boolean(context.canUngroup),
    isRelevant: (context) => Boolean(context.canUngroup),
    run: ({ item }, actions) => {
      if (item) actions.ungroup(item.id);
    },
  },
  {
    id: "enter-group",
    group: "group",
    label: () => strings.commands.enterGroup,
    icon: () => "mdi:login-variant",
    shortcuts: [{ key: "Enter" }],
    isEnabled: (context) => Boolean(context.canEnter),
    isRelevant: (context) => Boolean(context.canEnter),
    run: ({ item }, actions) => {
      if (item) actions.enterGroup(item.id);
    },
  },
  {
    id: "exit-group",
    group: "group",
    label: () => strings.commands.exitGroup,
    icon: () => "mdi:logout-variant",
    shortcuts: [{ key: "Escape" }],
    isEnabled: (context) => Boolean(context.entered),
    isRelevant: (context) => Boolean(context.entered),
    run: (_context, actions) => actions.exitGroup(),
  },
  {
    id: "deselect",
    group: "edit",
    label: () => strings.commands.deselect,
    icon: () => "mdi:selection-off",
    shortcuts: [{ key: "Escape" }],
    isEnabled: hasTargets,
    isRelevant: () => false,
    run: (_context, actions) => actions.deselect(),
  },
  {
    id: "save",
    group: "view",
    label: () => strings.commands.save,
    icon: () => "mdi:content-save-outline",
    shortcuts: [{ key: "s", mod: true }],
    anywhere: true,
    isEnabled: (context) => Boolean(context.dirty),
    run: (_context, actions) => actions.save(),
  },
  {
    id: "toggle-code",
    group: "view",
    label: () => strings.commands.toggleCode,
    icon: () => "mdi:code-tags",
    shortcuts: [{ key: "e", mod: true }],
    anywhere: true,
    isEnabled: () => true,
    run: (_context, actions) => actions.toggleCode(),
  },
  {
    id: "zoom-in",
    group: "view",
    label: () => strings.commands.zoomIn,
    icon: () => "mdi:magnify-plus-outline",
    shortcuts: [
      { key: "=", mod: true },
      { key: "+", mod: true },
    ],
    isEnabled: () => true,
    run: (_context, actions) => actions.zoom("in"),
  },
  {
    id: "zoom-out",
    group: "view",
    label: () => strings.commands.zoomOut,
    icon: () => "mdi:magnify-minus-outline",
    shortcuts: [{ key: "-", mod: true }],
    isEnabled: () => true,
    run: (_context, actions) => actions.zoom("out"),
  },
  {
    id: "zoom-reset",
    group: "view",
    label: () => strings.commands.zoomReset,
    icon: () => "mdi:magnify-scan",
    shortcuts: [{ key: "0", mod: true }],
    isEnabled: () => true,
    run: (_context, actions) => actions.zoom("reset"),
  },
  {
    id: "show-shortcuts",
    group: "view",
    label: () => strings.commands.showShortcuts,
    icon: () => "mdi:keyboard-outline",
    shortcuts: [{ key: "?" }],
    anywhere: true,
    isEnabled: () => true,
    run: (_context, actions) => actions.showShortcuts(),
  },
];

/** Whether a string is the id of a registered command. */
export const isCommandId = (id: string): id is CommandId =>
  COMMANDS.some((command) => command.id === id);

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
    // Symbols such as "?" and "+" need Shift on most keyboards; it is part of the key.
    (input.shiftKey === Boolean(shortcut.shift) || isShiftedSymbol(shortcut)) &&
    !input.altKey
  );
};

const isShiftedSymbol = (shortcut: Shortcut): boolean =>
  shortcut.key === "?" || shortcut.key === "+";

/**
 * The command a key press stands for, if any. Several commands can share a key (Escape
 * leaves a group, or else deselects); with a `context` the first one that can run wins.
 */
export const commandForKey = (
  input: KeyInput,
  context?: CommandContext
): Command | undefined => {
  const candidates = COMMANDS.filter((command) =>
    command.shortcuts.some((shortcut) => matches(shortcut, input))
  );
  if (!context) return candidates[0];
  return candidates.find((command) => command.isEnabled(context));
};

const KEY_NAMES: Record<string, string> = {
  Delete: "Del",
  Backspace: "⌫",
  Escape: "Esc",
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
};

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
  /** The first shortcut as the platform writes it, or an empty string. */
  shortcut: string;
  enabled: boolean;
}

export const commandView = (
  command: Command,
  context: CommandContext,
  mac = false
): CommandView => {
  const label = command.label(context);
  const [first] = command.shortcuts;
  const shortcut = first ? formatShortcut(first, mac) : "";
  return {
    label,
    icon: command.icon(context),
    title: shortcut ? `${label} (${shortcut})` : label,
    shortcut,
    enabled: command.isEnabled(context),
  };
};

/** Groups of commands for a menu; a separator is drawn between groups. */
export type MenuLayout = CommandId[][];

export const CANVAS_MENU: MenuLayout = [
  ["copy", "cut", "paste", "duplicate"],
  ["delete-item"],
  ["bring-to-front", "send-to-back"],
  ["group", "ungroup", "enter-group", "exit-group"],
];

export const TREE_MENU: MenuLayout = [
  ["copy", "cut", "paste"],
  ["move-up", "move-down"],
  ["toggle-hidden", "toggle-locked"],
  ["delete-item"],
  ["rename"],
  ["group", "ungroup", "enter-group", "exit-group"],
];

export const EMPTY_CANVAS_MENU: MenuLayout = [["paste", "paste-here"]];

/** One line of a menu. */
export interface MenuEntry {
  id: CommandId;
  label: string;
  icon: string;
  shortcut: string;
  disabled: boolean;
  danger: boolean;
  /** A separator is drawn above this entry. */
  separatorBefore: boolean;
}

/** The entries a menu offers in a context: relevant commands, dimmed when they cannot run. */
export const menuEntries = (
  layout: MenuLayout,
  context: CommandContext,
  mac: boolean
): MenuEntry[] =>
  layout.flatMap((section, sectionIndex) => {
    const entries = section
      .map((id) => commandById(id))
      .filter((command) => command.isRelevant?.(context) ?? true)
      .map((command, index) => {
        const view = commandView(command, context, mac);
        return {
          id: command.id,
          label: view.label,
          icon: view.icon,
          shortcut: view.shortcut,
          disabled: !view.enabled,
          danger: command.id === "delete-item",
          separatorBefore: index === 0 && sectionIndex > 0,
        };
      });
    return entries;
  });
