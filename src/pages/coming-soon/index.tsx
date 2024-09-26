import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export function Component() {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: theme.palette.primary.main,
      }}>
      <Box
        mb={3}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography
          display='inline'
          variant={isMd ? "h3" : "h2"}
          sx={{ textTransform: "uppercase" }}>
          Satin
          <Typography variant={isMd ? "h6" : "h5"} display='inline'>
            By
          </Typography>
        </Typography>
        <Typography
          variant={isMd ? "h6" : "h5"}
          sx={{ textTransform: "uppercase" }}>
          Sukhmani & Rupinder Kaur
        </Typography>
      </Box>
      <Typography variant={isMd ? "h4" : "h1"}>Coming Soon</Typography>
    </Box>
  );
}

// If you want to customize the Component display name in React dev tools:
Component.displayName = "ComingSoonPage";

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <h1>
        {error.status} {error.statusText}
      </h1>
    );
  }
  const errMsg = error instanceof Error ? error.message : "Unknown error";
  return <h1>{errMsg}</h1>;
}

ErrorBoundary.displayName = "ComingSoonErrorBoundary";
