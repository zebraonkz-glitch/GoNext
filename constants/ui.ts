export const UI = {
  surface: '#FFFFFF',
  surfaceMuted: '#F5F5F5',
  visitedSurface: '#F3F8F3',
  headerOverlay: 'rgba(255, 255, 255, 0.88)',
  primary: '#1565C0',
  error: '#B00020',
  radius: 8,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
} as const;

export const paperCardStyle = {
  backgroundColor: UI.surface,
  borderRadius: UI.radius,
};

export const paperInputStyle = {
  backgroundColor: UI.surface,
};

export const paperSearchbarStyle = {
  backgroundColor: UI.surface,
  marginHorizontal: UI.spacing.md,
  marginVertical: UI.spacing.sm,
  borderRadius: UI.radius,
};
