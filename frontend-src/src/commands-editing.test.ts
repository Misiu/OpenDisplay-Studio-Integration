import { describe, expect, it, vi } from "vitest";
import {
  CANVAS_MENU,
  EMPTY_CANVAS_MENU,
  TREE_MENU,
  commandById,
  commandForKey,
  isCommandId,
  menuEntries,
  type CommandActions,
  type CommandContext,
} from "./commands";
import { circleItem } from "./test-support";

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

const selected = (id: string): CommandContext => ({
  ...idle,
  item: circleItem(id),
  targets: [circleItem(id)],
});

describe("editing commands", () => {
  it("act on the selection", () => {
    const effects = actions();

    commandById("copy").run(selected("a"), effects);
    commandById("cut").run(selected("a"), effects);
    commandById("duplicate").run(selected("a"), effects);
    commandById("bring-to-front").run(selected("a"), effects);
    commandById("send-to-back").run(selected("a"), effects);
    commandById("move-up").run(selected("a"), effects);
    commandById("move-down").run(selected("a"), effects);

    expect(effects.copy).toHaveBeenCalledWith(["a"]);
    expect(effects.cut).toHaveBeenCalledWith(["a"]);
    expect(effects.duplicate).toHaveBeenCalledWith(["a"]);
    expect(effects.arrange).toHaveBeenNthCalledWith(1, ["a"], "front");
    expect(effects.arrange).toHaveBeenNthCalledWith(2, ["a"], "back");
    expect(effects.arrange).toHaveBeenNthCalledWith(3, ["a"], "up");
    expect(effects.arrange).toHaveBeenNthCalledWith(4, ["a"], "down");
  });

  it("need something selected, except paste, which needs something to paste", () => {
    for (const id of ["copy", "cut", "duplicate", "bring-to-front"] as const) {
      expect(commandById(id).isEnabled(idle), id).toBe(false);
      expect(commandById(id).isEnabled(selected("a")), id).toBe(true);
    }
    expect(commandById("paste").isEnabled(idle)).toBe(false);
    expect(commandById("paste").isEnabled({ ...idle, canPaste: true })).toBe(
      true
    );
  });

  it("nudge a step in their direction, by the snap size with Shift", () => {
    const effects = actions();

    commandById("nudge-left").run(selected("a"), effects);
    commandById("nudge-down-snap").run(selected("a"), effects);

    expect(effects.nudge).toHaveBeenNthCalledWith(1, ["a"], "left", false);
    expect(effects.nudge).toHaveBeenNthCalledWith(2, ["a"], "down", true);
  });

  it("save only when there is something to save, in the code view too", () => {
    expect(commandById("save").isEnabled(idle)).toBe(false);
    expect(commandById("save").isEnabled({ ...idle, dirty: true })).toBe(true);
    expect(commandById("save").anywhere).toBe(true);
    expect(commandById("copy").anywhere).toBeUndefined();
  });

  it("zoom, switch views and open the help", () => {
    const effects = actions();

    commandById("zoom-in").run(idle, effects);
    commandById("zoom-out").run(idle, effects);
    commandById("zoom-reset").run(idle, effects);
    commandById("toggle-code").run(idle, effects);
    commandById("show-shortcuts").run(idle, effects);

    expect(effects.zoom).toHaveBeenNthCalledWith(1, "in");
    expect(effects.zoom).toHaveBeenNthCalledWith(2, "out");
    expect(effects.zoom).toHaveBeenNthCalledWith(3, "reset");
    expect(effects.toggleCode).toHaveBeenCalled();
    expect(effects.showShortcuts).toHaveBeenCalled();
  });
});

describe("keys shared by several commands", () => {
  it("run the first command that can run: Escape leaves a group, or else deselects", () => {
    const entered: CommandContext = {
      ...idle,
      entered: true,
      targets: [circleItem()],
    };
    const selectedOnly: CommandContext = { ...idle, targets: [circleItem()] };

    expect(commandForKey(key("Escape"), entered)?.id).toBe("exit-group");
    expect(commandForKey(key("Escape"), selectedOnly)?.id).toBe("deselect");
    expect(commandForKey(key("Escape"), idle)).toBeUndefined();
  });

  it("include the arrow keys, with Shift for the larger step", () => {
    const context: CommandContext = { ...idle, targets: [circleItem()] };

    expect(commandForKey(key("ArrowLeft"), context)?.id).toBe("nudge-left");
    expect(commandForKey(key("ArrowUp", { shiftKey: true }), context)?.id).toBe(
      "nudge-up-snap"
    );
  });

  it("include the zoom, file and view keys", () => {
    expect(commandForKey(key("=", { ctrlKey: true }))?.id).toBe("zoom-in");
    expect(commandForKey(key("-", { ctrlKey: true }))?.id).toBe("zoom-out");
    expect(commandForKey(key("0", { ctrlKey: true }))?.id).toBe("zoom-reset");
    expect(commandForKey(key("s", { ctrlKey: true }))?.id).toBe("save");
    expect(commandForKey(key("e", { metaKey: true }))?.id).toBe("toggle-code");
    expect(commandForKey(key("d", { ctrlKey: true }))?.id).toBe("duplicate");
    expect(commandForKey(key("c", { ctrlKey: true }))?.id).toBe("copy");
    expect(commandForKey(key("F2"))?.id).toBe("rename");
    expect(commandForKey(key("?", { shiftKey: true }))?.id).toBe(
      "show-shortcuts"
    );
  });
});

describe("menus", () => {
  const withGroup: CommandContext = {
    ...idle,
    item: circleItem("g"),
    targets: [circleItem("g")],
    canUngroup: true,
    canEnter: true,
    canPaste: true,
  };

  it("offer the commands that apply, in sections split by separators", () => {
    const entries = menuEntries(CANVAS_MENU, withGroup, false);

    expect(entries.map((entry) => entry.id)).toEqual([
      "copy",
      "cut",
      "paste",
      "duplicate",
      "delete-item",
      "bring-to-front",
      "send-to-back",
      "ungroup",
      "enter-group",
    ]);
    expect(
      entries.filter((entry) => entry.separatorBefore).map((entry) => entry.id)
    ).toEqual(["delete-item", "bring-to-front", "ungroup"]);
  });

  it("show the shortcut of each command, and dim the ones that cannot run", () => {
    const entries = menuEntries(
      CANVAS_MENU,
      { ...withGroup, canPaste: false },
      false
    );

    expect(entries.find((entry) => entry.id === "paste")).toMatchObject({
      shortcut: "Ctrl+V",
      disabled: true,
    });
    expect(entries.find((entry) => entry.id === "copy")?.shortcut).toBe(
      "Ctrl+C"
    );
    expect(entries.find((entry) => entry.id === "delete-item")).toMatchObject({
      danger: true,
      shortcut: "Del",
    });
  });

  it("use the symbols of a Mac when asked to", () => {
    const entries = menuEntries(CANVAS_MENU, withGroup, true);

    expect(entries.find((entry) => entry.id === "copy")?.shortcut).toBe("⌘C");
    expect(entries.find((entry) => entry.id === "ungroup")?.shortcut).toBe(
      "⌘⇧G"
    );
  });

  it("leave out group commands that do not apply", () => {
    const plain: CommandContext = {
      ...idle,
      targets: [circleItem()],
      item: circleItem(),
    };

    const ids = menuEntries(TREE_MENU, plain, false).map((entry) => entry.id);

    expect(ids).not.toContain("ungroup");
    expect(ids).not.toContain("enter-group");
    expect(ids).toEqual(
      expect.arrayContaining([
        "move-up",
        "move-down",
        "rename",
        "toggle-hidden",
      ])
    );
  });

  it("offer only Paste and Paste here on empty canvas", () => {
    const ids = menuEntries(
      EMPTY_CANVAS_MENU,
      { ...idle, canPaste: true },
      false
    ).map((entry) => entry.id);

    expect(ids).toEqual(["paste", "paste-here"]);
  });

  it("know which strings are command ids", () => {
    expect(isCommandId("copy")).toBe(true);
    expect(isCommandId("nothing")).toBe(false);
  });
});
