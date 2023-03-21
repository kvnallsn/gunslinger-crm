import type { AppProps } from 'next/app';
import { Box, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import { SessionProvider } from "next-auth/react"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme } from "@mui/material";
import React from 'react';
import AppNavBar from '@/lib/components/app-navbar';

const version = process.env.NEXT_PUBLIC_GSCRM_VERSION ?? 'v0.0.0-dev';

export type ColorMode = 'light' | 'dark';

export const ColorModeContext = React.createContext({
  toggleColorMode: () => { },
  setMode: (mode: ColorMode) => { },
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [mode, setMode] = React.useState<ColorMode>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
      },

      setMode: (newMode: ColorMode) => {
        setMode(newMode);
      },
    }),
    []
  );

  const theme = React.useMemo(
    () => createTheme({
      palette: {
        mode
      }
    }),
    [mode]
  );

  return (
    <SessionProvider session={session}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex', height: '100vh' }}>
              <CssBaseline />
              <AppNavBar version={version} />
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Toolbar sx={{ display: { sm: 'none' } }} />
                <Component sx={{ flexGrow: 1 }} {...pageProps} />
              </Box>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SessionProvider>
  )
}
