import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { StyledLink } from "../../components/styled-link";

const NotFoundPage = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      }}>
      <Typography variant={isMd ? "h4" : "h1"}>404</Typography>
      <Typography variant={isMd ? "h4" : "h1"}>Page Not Found</Typography>
      <br />
      <StyledLink to='/'>Go Back</StyledLink>
    </Box>
  );
};

export default NotFoundPage;
