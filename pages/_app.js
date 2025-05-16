import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';
import { createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <MuiThemeWrapper>
        <CssBaseline />
        <Component {...pageProps} />
      </MuiThemeWrapper>
    </ThemeProvider>
  );
}

function MuiThemeWrapper({ children }) {
  const { isDark } = useTheme();
  
  const theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
    },
  });

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}