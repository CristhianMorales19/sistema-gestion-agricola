import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TextGeneric = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(
    135deg,
    ${theme.palette.text.primary} 0%,
    ${theme.palette.primary.light} 100%
  )`,
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.surface.light}40`,

  textAlign: "center",
}));
