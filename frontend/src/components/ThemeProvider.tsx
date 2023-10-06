'use client'

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: {
      main: '#000001',
    },
  },
  typography: {
    fontFamily: 'inherit'
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&.Mui-expanded': {
            margin: '0',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          '&.Mui-expanded $content': { // Increase specificity to target when expanded
            margin: '0', // Removes the margin
          },
        },
      }
    },
  },
});
theme = responsiveFontSizes(theme);

const ThemeProvider = ({children}: any) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;