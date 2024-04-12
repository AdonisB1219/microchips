import { createTheme } from '@mui/material/styles';

import { customShadows, overrides, palette, shadows, typography } from '.';

export type ColorMode = 'light' | 'dark';

export const createAppTheme = (mode: ColorMode) => {
  const themeValues = {
    palette: palette(mode),
    typography: typography,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1440,
      },
    },
  };

  const theme = createTheme(themeValues as any);

  theme.components = overrides(theme);

  return theme;
};
