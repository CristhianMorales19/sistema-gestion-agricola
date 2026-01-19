import { Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

export const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  gap: theme.spacing(2),

  [theme.breakpoints.up("lg")]: {
    flexDirection: "row",
  },
}));

export const CountChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,

  border: `1px solid ${theme.palette.primary.light}`,
  boxShadow: `0 0 0 1px ${theme.palette.primary.dark}20`,
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),

  flex: 1,
  minWidth: 0,
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "start",
  gap: theme.spacing(2),
}));
