/** M&H brand tokens — used throughout the widget. */
export const theme = {
  colors: {
    primary: '#2c3e38',       // Dark forest green — M&H primary
    primaryLight: '#3d5249',
    accent: '#8b7355',        // Warm bronze — CTA & accents
    accentHover: '#7a6449',
    background: '#faf8f4',    // Warm off-white
    surface: '#ffffff',
    surfaceBorder: '#e8e4dc',
    textPrimary: '#1a1a1a',
    textSecondary: '#5a5650',
    textMuted: '#8c8780',
    userBubble: '#e8e4dc',
    assistantBubble: '#ffffff',
    assistantBorder: '#e0ddd6',
    error: '#c0392b',
    success: '#27ae60',
    typing: '#8c8780',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  radius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  shadow: {
    widget: '0 8px 32px rgba(0,0,0,0.18)',
    button: '0 4px 16px rgba(44,62,56,0.35)',
  },
} as const;
