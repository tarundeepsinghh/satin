import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter";
import { ThemeProvider } from "@mui/material";
import { AppTheme } from "./AppTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={AppTheme}>
      {/* <Provider store={store}> */}
      <AppRouter />
      {/* </Provider> */}
    </ThemeProvider>
  </StrictMode>
);
