import { describe, expect, it } from "vitest";
import { groupByCategory } from "./catalog";
import { widgetDefinition } from "./test-support";
import { loadWidgetDefinitions } from "./widget-definitions";
import {
  formSelector,
  idsFromPicks,
  isMultiple,
  optionDefaults,
  optionsFromForm,
  picksFromIds,
  withPickFields,
} from "./widget-fields";

const agenda = widgetDefinition("agenda");
const calendars = agenda.sources[0];
const weather = widgetDefinition("weather").sources[0];
if (!calendars || !weather) {
  throw new Error("A built-in widget lost its source");
}

describe("the built-in widget definitions", () => {
  it("are the three catalog widgets, with the labels of their language", () => {
    const english = loadWidgetDefinitions("en").map((widget) => widget.name);
    const polish = loadWidgetDefinitions("pl").map((widget) => widget.name);

    expect(english).toEqual(["Agenda", "Sensor card", "Weather"]);
    expect(polish).toEqual(["Agenda", "Karta czujnika", "Pogoda"]);
  });

  it("group their options in sections a person can read", () => {
    expect(agenda.options.map((section) => section.section)).toEqual([
      "Content",
      "Presentation",
    ]);
  });
});

describe("optionDefaults", () => {
  it("gives every option the default its manifest declares", () => {
    expect(optionDefaults(agenda)).toMatchObject({
      maxEvents: 5,
      days: 14,
      groupByDay: true,
      showLocation: false,
    });
  });

  it("falls back to the first choice of a select that declares no default", () => {
    expect(optionDefaults(widgetDefinition("weather")).forecastType).toBe(
      "daily"
    );
  });
});

describe("formSelector", () => {
  it("turns the palette colour picker into a select of the display colours", () => {
    const selector = formSelector({ opendisplay_color: {} }, "bwr");

    expect(selector).toEqual({
      select: { options: ["black", "white", "red", "accent"] },
    });
  });

  it("leaves every other selector as Home Assistant knows it", () => {
    const selector = { entity: { multiple: true } };

    expect(formSelector(selector, "bw")).toBe(selector);
  });
});

describe("picks", () => {
  it("are a list when the selector allows several and one id when it does not", () => {
    expect(isMultiple(calendars)).toBe(true);
    expect(isMultiple(weather)).toBe(false);
    expect(idsFromPicks(calendars, [{ id: "a" }, { id: "b" }])).toEqual([
      "a",
      "b",
    ]);
    expect(idsFromPicks(weather, [{ id: "w" }])).toBe("w");
    expect(idsFromPicks(weather, [])).toBe("");
  });

  it("keep the fields of what stays picked and follow the order chosen", () => {
    const previous = [
      { id: "a", label: "Ola", color: "red" },
      { id: "b", label: "Jan" },
    ];

    const picks = picksFromIds(previous, ["b", "c", "a"]);

    expect(picks).toEqual([
      { id: "b", label: "Jan" },
      { id: "c" },
      { id: "a", label: "Ola", color: "red" },
    ]);
  });

  it("accept a single id, and none", () => {
    expect(picksFromIds([], "x")).toEqual([{ id: "x" }]);
    expect(picksFromIds([{ id: "x" }], "")).toEqual([]);
    expect(picksFromIds([{ id: "x" }], undefined)).toEqual([]);
  });

  it("change one field of one pick, and drop a field that was emptied", () => {
    const picks = [
      { id: "a", label: "Ola", color: "red" },
      { id: "b", label: "Jan" },
    ];

    const changed = withPickFields(picks, "a", { label: "" }, calendars);

    expect(changed).toEqual([{ id: "a", color: "red" }, picks[1]]);
  });

  it("ignore a field the source does not declare", () => {
    const changed = withPickFields(
      [{ id: "a" }],
      "a",
      { nonsense: "x", label: "Ola" },
      calendars
    );

    expect(changed).toEqual([{ id: "a", label: "Ola" }]);
  });
});

describe("optionsFromForm", () => {
  it("keeps the options the widget declares, of a kind it can store", () => {
    const values = {
      maxEvents: 3,
      groupByDay: false,
      emptyText: "Free",
      unknown: 1,
      broken: { nested: true },
    };

    expect(optionsFromForm(values, agenda)).toEqual({
      maxEvents: 3,
      groupByDay: false,
      emptyText: "Free",
    });
  });
});

describe("groupByCategory", () => {
  it("groups in the order categories first appear", () => {
    const groups = groupByCategory([
      { category: "Sensors", id: "a" },
      { category: "Calendar", id: "b" },
      { category: "Sensors", id: "c" },
    ]);

    expect(groups.map(([name, members]) => [name, members.length])).toEqual([
      ["Sensors", 2],
      ["Calendar", 1],
    ]);
  });
});
