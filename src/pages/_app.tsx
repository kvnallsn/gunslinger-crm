import type { AppProps } from 'next/app';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/lib/theme';
import Navbar from '@/lib/components/navbar';
import { SessionProvider } from "next-auth/react"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
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
    </SessionProvider>
  )
}
