import { createTheme } from "@mui/material";

export const AppTheme = createTheme({
  typography: {
    fontFamily: "Montserrat",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#DFE9E9",
    },
  },
});
