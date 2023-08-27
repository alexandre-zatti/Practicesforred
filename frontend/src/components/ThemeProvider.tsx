'use client'

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { responsiveFontSizes } from "@mui/material";

let theme = createTheme({});
theme = responsiveFontSizes(theme);

const ThemeProvider = ({children}: any) => (
  <MuiThemeProvider theme={theme}>
    {children}
  </MuiThemeProvider>
);

export default ThemeProvider;