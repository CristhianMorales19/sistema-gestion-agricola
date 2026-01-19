import {
  Table,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  Chip,
  Box,
  styled,
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";

// Contenedor de la tabla con efecto glass
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: `${theme.palette.background.default}`,

  borderRadius: theme.shape.borderRadius * 3,
  border: `1px solid ${theme.palette.surface.light}80`,
  boxShadow: `
      5px 5px 5px ${theme.palette.primary.main}30,
      inset 0 1px 0 ${theme.palette.surface.light}
    `,
  overflow: "hidden",
  position: "relative",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: `linear-gradient(
      90deg,
      transparent,
      ${theme.palette.primary.main}40,
      transparent
    )`,
    zIndex: 1,
  },
}));

// Tabla con estilo glass
export const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,

  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${theme.palette.surface.light}40`,
  },
}));

// Cabecera de la tabla
export const TableHeadRow = styled(TableRow)(({ theme }) => ({
  background: `linear-gradient(
    135deg,
    ${theme.palette.surface.main} 0%,
    ${theme.palette.surface.light} 100%
  )`,

  "&:last-child th": {
    borderBottom: `2px solid ${theme.palette.primary.main}40`,
  },
}));

// Celda de cabecera
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 700,
  fontSize: "0.875rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: theme.spacing(2),
  backgroundColor: "transparent",
  borderBottom: "none",
  textAlign: "center",

  "&:first-of-type": {
    borderTopLeftRadius: theme.shape.borderRadius * 2,
  },

  "&:last-of-type": {
    borderTopRightRadius: theme.shape.borderRadius * 2,
  },
}));

// Fila de la tabla con efectos
export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  backgroundColor: isSelected
    ? `${theme.palette.primary.main}15`
    : "transparent",
  cursor: "pointer",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    backgroundColor: isSelected
      ? `${theme.palette.primary.main}25`
      : `${theme.palette.surface.light}20`,
    transform: "translateX(2px)",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "3px",
      background: `linear-gradient(
        180deg,
        ${theme.palette.primary.main},
        ${theme.palette.primary.light}
      )`,
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  },

  "&:last-child td": {
    borderBottom: "none",
  },
}));

// Celda del cuerpo
export const BodyCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  fontSize: "0.875rem",
  padding: theme.spacing(1),
  backgroundColor: "transparent",
  borderBottom: `1px solid ${theme.palette.surface.light}20`,
  transition: "all 0.3s ease",
  textAlign: "center",

  "&:hover": {
    color: theme.palette.primary.light,
  },
}));

// Chip de estado
export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status?: boolean }>(({ theme, status }) => {
  let backgroundColor, color, borderColor;

  if (status === true) {
    backgroundColor = `${theme.palette.success.main}20`;
    color = theme.palette.success.light;
    borderColor = theme.palette.success.main;
  } else if (status === false) {
    backgroundColor = `${theme.palette.error.main}20`;
    color = theme.palette.error.light;
    borderColor = theme.palette.error.main;
  } else {
    backgroundColor = `${theme.palette.warning.main}20`;
    color = theme.palette.warning.light;
    borderColor = theme.palette.warning.main;
  }

  return {
    backgroundColor,
    color,
    border: `1px solid ${borderColor}40`,
    borderRadius: theme.shape.borderRadius * 1.5,
    fontWeight: 600,
    fontSize: "0.75rem",
    padding: theme.spacing(0.5, 1),
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",

    "&:hover": {
      backgroundColor: `${backgroundColor}DD`,
      transform: "translateY(-1px)",
      boxShadow: `0 4px 12px -4px ${borderColor}30`,
    },
  };
});

// Contenedor de acciones
export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  justifyContent: "center",
}));

// Botón de editar
export const EditButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
  backgroundColor: `${theme.palette.primary.main}15`,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(0.75),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: `${theme.palette.primary.main}40`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px -4px ${theme.palette.primary.main}40`,
  },

  "&:active": {
    transform: "translateY(0)",
  },
}));

// Botón de eliminar
export const DeleteButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.error.light,
  backgroundColor: `${theme.palette.error.main}15`,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(0.75),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: `${theme.palette.error.main}40`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px -4px ${theme.palette.error.main}40`,
  },

  "&:active": {
    transform: "translateY(0)",
  },
}));

// Botón de editar
export const AddButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.light,
  backgroundColor: `${theme.palette.primary.main}15`,
  borderRadius: theme.shape.borderRadius * 1.5,
  padding: theme.spacing(0.75),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor: `${theme.palette.primary.main}40`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px -4px ${theme.palette.primary.main}40`,
  },

  "&:active": {
    transform: "translateY(0)",
  },
}));

// Iconos
export const StyledEditIcon = styled(Edit)(() => ({
  fontSize: "1.125rem",
}));

export const StyledDeleteIcon = styled(Delete)(() => ({
  fontSize: "1.125rem",
}));

export const StyledAddIcon = styled(Add)(() => ({
  fontSize: "1.125rem",
}));

// Mensaje para tabla vacía
export const EmptyTableMessage = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  textAlign: "center",

  "&::before": {
    fontSize: "3rem",
    marginBottom: theme.spacing(2),
    opacity: 0.5,
  },
}));

// Fila de mensaje vacío
export const EmptyRow = styled(TableRow)(({ theme }) => ({
  "& td": {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    fontStyle: "italic",
    backgroundColor: `${theme.palette.surface.light}10`,
    borderRadius: theme.shape.borderRadius * 2,
  },
}));
