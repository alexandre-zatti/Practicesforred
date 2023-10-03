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
    fontFamily: 'Poppins, sans-serif', // Replace 'Your Font Name' with the name of the font you chose.
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