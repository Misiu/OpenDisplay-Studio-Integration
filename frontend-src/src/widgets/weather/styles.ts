import { css } from 'lit'

export const weatherStyles = css`
  .weather-widget-placeholder {
    align-items: center;
    justify-content: center;
    gap: clamp(4px, 3cqh, 12px);
    text-align: center;
  }

  .weather-widget-placeholder svg {
    width: clamp(24px, min(28cqw, 28cqh), 72px);
    height: clamp(24px, min(28cqw, 28cqh), 72px);
  }

  .weather-widget-placeholder strong {
    font-size: clamp(12px, min(12cqw, 12cqh), 28px);
  }

  .weather-widget-placeholder span {
    max-width: 90%;
    overflow: hidden;
    font-size: clamp(8px, min(7cqw, 7cqh), 15px);
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`
