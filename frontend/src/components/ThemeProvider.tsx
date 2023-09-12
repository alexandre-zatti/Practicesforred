'use client'

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  palette: {
    primary: {
      main: '#4A4A4A',
    },
  },
  components: {
    MuiAccordionSummary: {
      defaultProps: {
        style: {borderRadius: '5px'},
      },
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