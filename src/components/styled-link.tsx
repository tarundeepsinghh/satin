import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  textDecoration: "none",
  padding: theme.spacing(1.5),
  color: theme.palette.secondary.main,
  "&:active": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.secondary.main,
  },
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
}));
