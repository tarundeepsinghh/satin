import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { StyledLink } from "../../components/styled-link";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import InstagramIcon from "@mui/icons-material/Instagram";

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <StyledLink
          to='https://wa.me/message/UPH5NISFYWDFF1'
          sx={{
            mt: 3,
            backgroundColor: theme.palette.secondary.main,
            color: "#25d366",
            border: "1px solid #25d366",
            ":hover": { backgroundColor: "#25d366", border: "none" },
            display: "flex",
          }}>
          <WhatsAppIcon sx={{ mr: 1 }} />
          Contact Us
        </StyledLink>
        <StyledLink
          to='https://www.instagram.com/satin_by_sukhmanikaur?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
          sx={{
            mt: 3,
            backgroundColor: theme.palette.secondary.main,
            color: "#fd5949",
            border: "1px solid",
            borderImage:
              "radial-gradient(circle at 30% 107%, #fdf497, #fd5949, #d6249f, #285AEB) 1",
            ":hover": {
              background:
                "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%,#d6249f 60%,#285AEB 90%)",
            },
            display: "flex",
          }}>
          <InstagramIcon sx={{ mr: 1 }} />
          Contact Us
        </StyledLink>
      </Box>
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
