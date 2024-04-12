import { CssBaseline, ThemeProvider } from '@mui/material';
import { useMemo } from 'react';

import { createAppTheme } from '../utils';

export type AppThemeProps = {
  children: React.ReactNode;
};

export type ColorMode = 'light' | 'dark';

const AppTheme: React.FC<AppThemeProps> = ({ children }) => {
  const mode: ColorMode = 'light';
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </ThemeProvider>
  );
};

export default AppTheme;
