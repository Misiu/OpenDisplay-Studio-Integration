"""Hardcoded renderable documents for the proof of concept."""

from __future__ import annotations

from homeassistant.util import dt as dt_util


def build_test_screen() -> str:
    """Build the timestamped test screen using Home Assistant local time."""
    current_time = dt_util.now().strftime("%H:%M:%S")
    return f"""
<style>
  .test-screen {{
    width: 100%; height: 100%; padding: 42px 54px;
    display: grid; grid-template-rows: auto 1fr auto;
    border: 4px solid #000; background: #fff; color: #000;
  }}
  .test-title {{ font-size: 34px; font-weight: 700; }}
  .test-time {{ align-self: center; justify-self: center; font-size: 92px;
    font-weight: 700; font-variant-numeric: tabular-nums; }}
  .test-note {{ font-size: 28px; }}
</style>
<main class="test-screen">
  <header class="test-title">OpenDisplay Studio</header>
  <time class="test-time">{current_time}</time>
  <footer class="test-note">Renderer test</footer>
</main>
"""


def build_dashboard_screen() -> str:
    """Build the static multi-region layout exercise."""
    return """
<style>
  .dashboard { width: 100%; height: 100%; display: grid;
    grid-template-columns: 1fr 1fr; grid-template-rows: 48% 52%;
    border: 4px solid #000; background: #fff; color: #000; }
  .metric { padding: 26px 32px; display: grid; grid-template-rows: auto 1fr;
    min-width: 0; overflow: hidden; }
  .metric:first-child { border-right: 3px solid #000; }
  .label { font-size: 22px; font-weight: 700; letter-spacing: 2px; }
  .value { align-self: center; justify-self: center; font-size: 64px;
    font-weight: 700; white-space: nowrap; }
  .upcoming { grid-column: 1 / 3; border-top: 3px solid #000;
    padding: 22px 32px; overflow: hidden; }
  .upcoming h2 { margin: 0 0 14px; font-size: 28px; }
  .upcoming ul { margin: 0; padding: 0; list-style: none; font-size: 23px;
    line-height: 1.65; white-space: nowrap; overflow: hidden; }
  .upcoming time { display: inline-block; width: 84px; font-weight: 700;
    font-variant-numeric: tabular-nums; }
</style>
<main class="dashboard">
  <section class="metric">
    <div class="label">WEATHER</div><div class="value">21.4°C</div>
  </section>
  <section class="metric">
    <div class="label">TEMPERATURE</div><div class="value">22.7°C</div>
  </section>
  <section class="upcoming"><h2>Upcoming</h2><ul>
    <li><time>10:00</time>Production meeting</li>
    <li><time>13:30</time>Lunch</li>
    <li><time>16:00</time>Project review</li>
  </ul></section>
</main>
"""


SCREENS = {
    "test": ("Test screen", build_test_screen),
    "dashboard": ("Dashboard", build_dashboard_screen),
}
