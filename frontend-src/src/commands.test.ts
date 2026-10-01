import { describe, expect, it, vi } from "vitest";
import {
  COMMANDS,
  commandById,
  commandForKey,
  commandView,
  formatShortcut,
  itemContext,
  type CommandActions,
  type CommandContext,
} from "./commands";
import { circleItem, rectangleItem } from "./test-support";

const idle: CommandContext = { canUndo: false, canRedo: false };

const actions = (): CommandActions => ({
  undo: vi.fn(),
  redo: vi.fn(),
  requestDelete: vi.fn(),
  toggleFlag: vi.fn(),
  group: vi.fn(),
  ungroup: vi.fn(),
  enterGroup: vi.fn(),
  exitGroup: vi.fn(),
  deselect: vi.fn(),
  copy: vi.fn(),
  cut: vi.fn(),
  paste: vi.fn(),
  pasteHere: vi.fn(),
  duplicate: vi.fn(),
  arrange: vi.fn(),
  rename: vi.fn(),
  save: vi.fn(),
  toggleCode: vi.fn(),
  zoom: vi.fn(),
  nudge: vi.fn(),
  showShortcuts: vi.fn(),
});

const key = (
  name: string,
  modifiers: Partial<{
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    altKey: boolean;
  }> = {}
) => ({
  key: name,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  ...modifiers,
});

describe("the registry", () => {
  it("has one command per id, each with a label, icon and enabled rule", () => {
    const ids = COMMANDS.map((command) => command.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining([
        "undo",
        "redo",
        "delete-item",
        "toggle-hidden",
        "toggle-locked",
        "group",
        "ungroup",
        "enter-group",
        "exit-group",
        "copy",
        "cut",
        "paste",
        "duplicate",
        "bring-to-front",
        "send-to-back",
        "move-up",
        "move-down",
        "save",
      ])
    );
  });

  it("finds a command by id", () => {
    expect(commandById("undo").id).toBe("undo");
  });
});

describe("undo and redo", () => {
  it("are enabled only when there is something to undo or redo", () => {
    expect(commandById("undo").isEnabled(idle)).toBe(false);
    expect(commandById("undo").isEnabled({ ...idle, canUndo: true })).toBe(
      true
    );
    expect(commandById("redo").isEnabled({ ...idle, canUndo: true })).toBe(
      false
    );
    expect(commandById("redo").isEnabled({ ...idle, canRedo: true })).toBe(
      true
    );
  });

  it("run the matching action", () => {
    const effects = actions();
    commandById("undo").run(idle, effects);
    commandById("redo").run(idle, effects);
    expect(effects.undo).toHaveBeenCalledTimes(1);
    expect(effects.redo).toHaveBeenCalledTimes(1);
  });
});

describe("commands about an item", () => {
  it("need an item to be enabled", () => {
    for (const id of [
      "delete-item",
      "toggle-hidden",
      "toggle-locked",
    ] as const) {
      expect(commandById(id).isEnabled(idle), id).toBe(false);
      expect(commandById(id).isEnabled(itemContext(circleItem())), id).toBe(
        true
      );
    }
  });

  it("delete asks to delete the item; they never act without one", () => {
    const effects = actions();
    commandById("delete-item").run(itemContext(circleItem("c")), effects);
    commandById("delete-item").run(idle, effects);
    expect(effects.requestDelete).toHaveBeenCalledTimes(1);
    expect(effects.requestDelete).toHaveBeenCalledWith(["c"]);
  });

  it("toggle the flag they are named after", () => {
    const effects = actions();
    commandById("toggle-hidden").run(itemContext(circleItem("c")), effects);
    commandById("toggle-locked").run(itemContext(circleItem("c")), effects);
    expect(effects.toggleFlag).toHaveBeenNthCalledWith(1, ["c"], "hidden");
    expect(effects.toggleFlag).toHaveBeenNthCalledWith(2, ["c"], "locked");
  });

  it("change their label and icon with the state of the item", () => {
    const item = rectangleItem();
    expect(
      commandView(commandById("toggle-hidden"), itemContext(item))
    ).toMatchObject({
      label: "Hide",
      icon: "mdi:eye-outline",
    });
    expect(
      commandView(commandById("toggle-locked"), itemContext(item))
    ).toMatchObject({
      label: "Lock",
      icon: "mdi:lock-open-variant-outline",
    });
    item.hidden = true;
    item.locked = true;
    expect(
      commandView(commandById("toggle-hidden"), itemContext(item))
    ).toMatchObject({
      label: "Show",
      icon: "mdi:eye-off-outline",
    });
    expect(
      commandView(commandById("toggle-locked"), itemContext(item))
    ).toMatchObject({
      label: "Unlock",
      icon: "mdi:lock",
    });
  });
});

describe("commands about several items", () => {
  it("delete and hide act on the whole selection at once", () => {
    const effects = actions();
    const context: CommandContext = {
      ...idle,
      item: circleItem("b"),
      targets: [circleItem("a"), circleItem("b")],
    };

    commandById("delete-item").run(context, effects);
    commandById("toggle-hidden").run(context, effects);

    expect(effects.requestDelete).toHaveBeenCalledWith(["a", "b"]);
    expect(effects.toggleFlag).toHaveBeenCalledWith(["a", "b"], "hidden");
  });
});

describe("group commands", () => {
  it("are available only when the shell says they apply", () => {
    expect(commandById("group").isEnabled(idle)).toBe(false);
    expect(commandById("group").isEnabled({ ...idle, canGroup: true })).toBe(
      true
    );
    expect(
      commandById("ungroup").isEnabled({ ...idle, canUngroup: true })
    ).toBe(true);
    expect(
      commandById("enter-group").isEnabled({ ...idle, canEnter: true })
    ).toBe(true);
    expect(
      commandById("exit-group").isEnabled({ ...idle, entered: true })
    ).toBe(true);
    expect(commandById("exit-group").isEnabled(idle)).toBe(false);
  });

  it("group the whole selection, and ungroup or enter the main item", () => {
    const effects = actions();
    const context: CommandContext = {
      ...idle,
      item: circleItem("b"),
      targets: [circleItem("a"), circleItem("b")],
      canGroup: true,
      canUngroup: true,
      canEnter: true,
      entered: true,
    };

    commandById("group").run(context, effects);
    commandById("ungroup").run(context, effects);
    commandById("enter-group").run(context, effects);
    commandById("exit-group").run(context, effects);

    expect(effects.group).toHaveBeenCalledWith(["a", "b"]);
    expect(effects.ungroup).toHaveBeenCalledWith("b");
    expect(effects.enterGroup).toHaveBeenCalledWith("b");
    expect(effects.exitGroup).toHaveBeenCalledTimes(1);
  });

  it("show their shortcuts in the tooltip", () => {
    expect(commandView(commandById("group"), idle, false).title).toBe(
      "Make group (Ctrl+G)"
    );
    expect(commandView(commandById("ungroup"), idle, false).title).toBe(
      "Ungroup (Ctrl+Shift+G)"
    );
    expect(commandView(commandById("exit-group"), idle, false).title).toBe(
      "Exit group (Esc)"
    );
  });
});

describe("shortcuts", () => {
  it.each([
    [key("z", { ctrlKey: true }), "undo"],
    [key("z", { metaKey: true }), "undo"],
    [key("Z", { ctrlKey: true }), "undo"],
    [key("z", { ctrlKey: true, shiftKey: true }), "redo"],
    [key("y", { ctrlKey: true }), "redo"],
    [key("Delete"), "delete-item"],
    [key("Backspace"), "delete-item"],
    [key("g", { ctrlKey: true }), "group"],
    [key("g", { ctrlKey: true, shiftKey: true }), "ungroup"],
    [key("Enter"), "enter-group"],
    [key("Escape"), "exit-group"],
  ])("%j runs %s", (event, expected) => {
    expect(commandForKey(event)?.id).toBe(expected);
  });

  it.each([
    ["a bare letter", key("z")],
    ["Ctrl with another letter", key("q", { ctrlKey: true })],
    ["Ctrl+Alt+Z", key("z", { ctrlKey: true, altKey: true })],
    ["Ctrl+Delete", key("Delete", { ctrlKey: true })],
    ["Shift+Delete", key("Delete", { shiftKey: true })],
    ["an unrelated key", key("F5")],
    ["Ctrl+Enter", key("Enter", { ctrlKey: true })],
  ])("do not match %s", (_name, event) => {
    expect(commandForKey(event)).toBeUndefined();
  });

  it("shows the first shortcut of a command in its tooltip", () => {
    expect(commandView(commandById("undo"), idle, false).title).toBe(
      "Undo (Ctrl+Z)"
    );
    expect(commandView(commandById("redo"), idle, false).title).toBe(
      "Redo (Ctrl+Shift+Z)"
    );
    expect(commandView(commandById("delete-item"), idle, false).title).toBe(
      "Delete (Del)"
    );
  });

  it("uses the platform's symbols", () => {
    expect(formatShortcut({ key: "z", mod: true }, false)).toBe("Ctrl+Z");
    expect(formatShortcut({ key: "z", mod: true, shift: true }, false)).toBe(
      "Ctrl+Shift+Z"
    );
    expect(formatShortcut({ key: "z", mod: true }, true)).toBe("⌘Z");
    expect(formatShortcut({ key: "z", mod: true, shift: true }, true)).toBe(
      "⌘⇧Z"
    );
    expect(formatShortcut({ key: "Delete" }, false)).toBe("Del");
  });

  it("gives a command without a shortcut a tooltip of just its label", () => {
    expect(
      commandView(commandById("toggle-hidden"), itemContext(circleItem())).title
    ).toBe("Hide");
  });
});

describe("commandView", () => {
  it("reports whether the command can run right now", () => {
    expect(commandView(commandById("undo"), idle).enabled).toBe(false);
    expect(
      commandView(commandById("undo"), { ...idle, canUndo: true }).enabled
    ).toBe(true);
  });
});
