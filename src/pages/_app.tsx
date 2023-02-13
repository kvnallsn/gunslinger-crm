import type { AppProps } from 'next/app';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/lib/theme';
import Navbar from '@/lib/components/navbar';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <CssBaseline />
        <Navbar /> 
        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Component {...pageProps} />
        </Box>
      </Box>
    </ThemeProvider>
  )
}
