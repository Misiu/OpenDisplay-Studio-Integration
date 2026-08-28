import { css } from 'lit'

export const sensorStyles = css`
  .sensor-widget {
    justify-content: space-between;
  }

  .sensor-name {
    max-width: 100%;
    overflow: hidden;
    font-size: clamp(10px, 6cqh, 20px);
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sensor-reading {
    display: flex;
    flex: 1;
    align-items: center;
    align-self: stretch;
    justify-content: center;
    gap: clamp(8px, 5cqw, 24px);
  }

  .sensor-reading > .widget-icon {
    width: clamp(28px, 24cqh, 72px);
    height: clamp(28px, 24cqh, 72px);
  }

  .sensor-reading > strong {
    font-size: clamp(26px, 22cqh, 76px);
    line-height: 1;
  }
`
