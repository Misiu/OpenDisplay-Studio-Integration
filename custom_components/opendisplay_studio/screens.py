"""Stage 2 renderable TRMNL Framework documents."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Final

from homeassistant.util import dt as dt_util

from .liquid_renderer import LIQUID


@dataclass(frozen=True, slots=True)
class BuiltScreen:
    """Final HTML and integration-side timing measurements."""

    html: str
    liquid_ms: float = 0.0


@dataclass(frozen=True, slots=True)
class ScreenDefinition:
    """A Media Source document with a fixed POC display profile."""

    title: str
    width: int
    height: int
    builder: Callable[[], BuiltScreen]


def _screen(body: str, *, mode: str = "screen--1bit", size: str = "screen--md") -> str:
    return f'<main class="screen {mode} {size}"><div class="view view--full">{body}</div></main>'


def _static(html: str) -> Callable[[], BuiltScreen]:
    return lambda: BuiltScreen(html)


def build_test_screen() -> str:
    """Build the timestamped regression screen."""
    current_time = dt_util.now().strftime("%H:%M:%S")
    return _screen(
        f"""
<div class="layout layout--col flex flex--center gap--large">
  <span class="title title--large">OpenDisplay Studio</span>
  <span class="value value--xxxlarge value--tnums">{current_time}</span>
  <span class="label label--large">Renderer test · zażółć gęślą jaźń</span>
</div>
<div class="title_bar"><span class="title">Stage 2</span><span class="instance">live</span></div>
"""
    )


def build_dashboard_screen() -> str:
    """Build the original multi-region concept with Framework primitives."""
    return _screen(
        """
<div class="layout layout--col gap--large">
  <div class="grid grid--cols-2 gap--large">
    <div class="item"><div class="meta"></div><div class="content"><span class="value value--xxlarge value--tnums">21.4°C</span><span class="label">Weather</span></div></div>
    <div class="item"><div class="meta"></div><div class="content"><span class="value value--xxlarge value--tnums">22.7°C</span><span class="label">Temperature</span></div></div>
  </div>
  <div class="item"><div class="meta"></div><div class="content"><span class="title">Upcoming</span><span class="description">10:00 Production meeting · 13:30 Lunch · 16:00 Project review</span></div></div>
</div>
<div class="title_bar"><span class="title">Dashboard</span><span class="instance">static</span></div>
"""
    )


TYPOGRAPHY = _screen(
    """
<div class="layout layout--col gap--large">
  <span class="title title--xlarge">TRMNL Typography</span>
  <span class="value value--xxxlarge value--tnums">12 345,67</span>
  <span class="description description--large">Pchnąć w tę łódź jeża lub ośm skrzyń fig · Łódź</span>
  <div class="flex flex--row gap--large"><span class="label">regular label</span><span class="label font--bold">bold label</span></div>
</div>
<div class="title_bar"><span class="title">Font &amp; glyph test</span><span class="instance">800×480</span></div>
"""
)

TABLE = _screen(
    """
<div class="layout layout--col">
  <table class="table table--large" data-table-limit="true">
    <thead><tr><th><span class="title">Room</span></th><th><span class="title">Temp.</span></th><th><span class="title">State</span></th></tr></thead>
    <tbody>
      <tr><td><span class="label">Kuchnia</span></td><td><span class="value value--small value--tnums">21.4°C</span></td><td><span class="label">OK</span></td></tr>
      <tr><td><span class="label">Salon</span></td><td><span class="value value--small value--tnums">22.7°C</span></td><td><span class="label">Heating</span></td></tr>
      <tr><td><span class="label">Sypialnia — bardzo długa nazwa</span></td><td><span class="value value--small value--tnums">19.8°C</span></td><td><span class="label">Eco</span></td></tr>
    </tbody>
  </table>
</div>
<div class="title_bar"><span class="title">Table &amp; overflow</span><span class="instance">3 rooms</span></div>
"""
)


def _palette(mode: str, label: str) -> str:
    return _screen(
        f"""
<div class="layout layout--col gap--large">
  <span class="title title--large">Palette {label}</span>
  <div class="grid grid--cols-4 gap--small">
    <div class="item bg--black"><div class="content"><span class="label text--white">BLACK</span></div></div>
    <div class="item bg--white"><div class="content"><span class="label">WHITE</span></div></div>
    <div class="item bg--red"><div class="content"><span class="label">RED</span></div></div>
    <div class="item bg--yellow"><div class="content"><span class="label">YELLOW</span></div></div>
  </div>
  <div class="progress-bar w--full"><div class="track"><div class="fill" style="width: 68%"></div></div></div>
</div>
<div class="title_bar"><span class="title">Same markup</span><span class="instance">{label}</span></div>
""",
        mode=mode,
    )


SMALL = _screen(
    """
<div class="layout flex flex--center" style="display: flex; flex-direction: column; gap: 6px"><span class="value value--base value--tnums" style="line-height: 1">21.4°</span><span class="label label--small" style="line-height: 1.2">Łódź · teraz</span></div>
<div class="title_bar"><span class="title">Small</span><span class="instance">296×128</span></div>
""",
    size="",
)

LARGE = _screen(
    """
<div class="layout layout--col gap--xxlarge">
  <div class="grid grid--cols-3 gap--large">
    <div class="item"><div class="content"><span class="value value--giga">21.4°</span><span class="label label--large">Outside</span></div></div>
    <div class="item"><div class="content"><span class="value value--giga">22.7°</span><span class="label label--large">Inside</span></div></div>
    <div class="item"><div class="content"><span class="value value--giga">47%</span><span class="label label--large">Humidity</span></div></div>
  </div>
  <div class="grid grid--cols-2 gap--large">
    <div class="item"><div class="content"><span class="title title--large">Production meeting</span><span class="description description--large">10:00 · Conference room</span></div></div>
    <div class="item"><div class="content"><span class="title title--large">Project review</span><span class="description description--large">16:00 · OpenDisplay Studio</span></div></div>
  </div>
</div>
<div class="title_bar"><span class="title">Large dashboard</span><span class="instance">1200×825</span></div>
""",
    mode="screen--color-4bwry",
    size="screen--lg",
)

LIQUID_TEMPLATE: Final = """
<main class="screen screen--color-3bwr screen--md"><div class="view view--full">
  <div class="layout layout--col gap--large">
    <div class="grid grid--cols-3 gap--large">
    {% for metric in metrics %}
      <div class="item"><div class="meta"></div><div class="content">
        <span class="value value--xxlarge value--tnums" data-fit-value="true">{{ metric.value | default: "—" }}{{ metric.unit | default: "" }}</span>
        <span class="label">{{ metric.label | default: "Missing label" }}</span>
      </div></div>
    {% endfor %}
    </div>
    {% if events.size > 0 %}
      <table class="table table--small" data-table-limit="true"><tbody>
      {% for event in events %}<tr><td><span class="value value--xxsmall value--tnums">{{ event.time }}</span></td><td><span class="label">{{ event.title }}</span></td></tr>{% endfor %}
      </tbody></table>
    {% else %}<span class="label">Brak nadchodzących zdarzeń</span>{% endif %}
  </div>
  <div class="title_bar"><span class="title">{{ title | default: "OpenDisplay Studio" }}</span><span class="instance">{{ generated_at }}</span></div>
</div></main>
"""


def build_liquid_screen() -> BuiltScreen:
    """Render dynamic HTML before Chromium and expose the Liquid time."""
    now = dt_util.now()
    result = LIQUID.render(
        LIQUID_TEMPLATE,
        {
            "title": "Liquid · Łódź",
            "generated_at": now.strftime("%H:%M:%S"),
            "metrics": [
                {"label": "Temperatura", "value": 21.4, "unit": "°C"},
                {"label": "Wilgotność", "value": 47, "unit": "%"},
                {"label": "Ciśnienie", "value": 1017, "unit": " hPa"},
            ],
            "events": [
                {"time": "10:00", "title": "Spotkanie produkcyjne"},
                {"time": "16:00", "title": "Przegląd projektu"},
            ],
        },
    )
    return BuiltScreen(result.html, result.milliseconds)


SCREENS: Final = {
    "test": ScreenDefinition(
        "Test screen", 800, 480, lambda: BuiltScreen(build_test_screen())
    ),
    "dashboard": ScreenDefinition(
        "Dashboard", 800, 480, lambda: BuiltScreen(build_dashboard_screen())
    ),
    "trmnl_typography": ScreenDefinition(
        "TRMNL · Typography", 800, 480, _static(TYPOGRAPHY)
    ),
    "trmnl_table": ScreenDefinition("TRMNL · Table", 800, 480, _static(TABLE)),
    "trmnl_liquid": ScreenDefinition(
        "TRMNL · Liquid dynamic", 800, 480, build_liquid_screen
    ),
    "trmnl_palette_bw": ScreenDefinition(
        "TRMNL · Palette BW", 800, 480, _static(_palette("screen--1bit", "BW"))
    ),
    "trmnl_palette_bwr": ScreenDefinition(
        "TRMNL · Palette BWR", 800, 480, _static(_palette("screen--color-3bwr", "BWR"))
    ),
    "trmnl_palette_bwry": ScreenDefinition(
        "TRMNL · Palette BWRY",
        800,
        480,
        _static(_palette("screen--color-4bwry", "BWRY")),
    ),
    "trmnl_small": ScreenDefinition("TRMNL · Small 296×128", 296, 128, _static(SMALL)),
    "trmnl_large": ScreenDefinition(
        "TRMNL · Large 1200×825", 1200, 825, _static(LARGE)
    ),
}
