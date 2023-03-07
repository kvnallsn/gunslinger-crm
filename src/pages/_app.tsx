import type { AppProps } from 'next/app';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Navbar from '@/lib/components/navbar';
import { SessionProvider } from "next-auth/react"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createTheme } from "@mui/material";
import React from 'react';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prev => (prev === 'light' ? 'dark' : 'light'));
      }
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
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <CssBaseline />
              <Navbar />
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Component {...pageProps} />
              </Box>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </SessionProvider>
  )
}
