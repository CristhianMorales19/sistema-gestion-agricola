import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TextFieldGeneric = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "disabled" && prop !== "readonly",
})<{ disabled?: boolean; readonly?: boolean }>(({
  theme,
  disabled,
  readonly,
}) => {
  const baseBackground = readonly
    ? `${theme.palette.surface.light}`
    : `${theme.palette.background.default}`;

  return {
    // Label
    "& .MuiInputLabel-root": {
      color: disabled
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
      fontWeight: 500,
      fontSize: "0.875rem",
      transform: "translate(14px, 14px) scale(1)",

      "&.Mui-focused": {
        color: disabled
          ? theme.palette.text.secondary
          : theme.palette.primary.light,
      },

      "&.MuiInputLabel-shrink": {
        transform: "translate(14px, -20px) scale(0.75)",
      },

      "& .MuiInputLabel-asterisk": {
        display: "none",
      },
    },

    // Input root (caja)
    "& .MuiOutlinedInput-root": {
      backgroundColor: baseBackground,
      borderRadius: theme.shape.borderRadius * 2,
      border: `1px solid ${theme.palette.surface.light}80`,
      transition: "all 0.25s ease",

      "&:hover": {
        backgroundColor: readonly
          ? baseBackground
          : `${theme.palette.surface.main}60`,
        borderColor: disabled
          ? theme.palette.surface.light
          : `${theme.palette.primary.main}60`,
        boxShadow: disabled
          ? `0 4px 12px -2px ${theme.palette.surface.light}30`
          : `0 4px 16px -4px ${theme.palette.primary.light}`,
      },

      "&.Mui-focused": {
        backgroundColor: `${theme.palette.surface.main}80`,
        borderColor: theme.palette.primary.main,
        boxShadow: `
          0 0 0 3px ${theme.palette.primary.main}20,
          0 6px 20px -6px ${theme.palette.primary.main}40
        `,
      },

      "&.Mui-error": {
        borderColor: theme.palette.error.main,

        "&:hover": {
          borderColor: theme.palette.error.light,
          boxShadow: `0 4px 16px -4px ${theme.palette.error.main}30`,
        },

        "&.Mui-focused": {
          boxShadow: `
            0 0 0 3px ${theme.palette.error.main}20,
            0 6px 20px -6px ${theme.palette.error.main}40
          `,
        },
      },

      "& fieldset": {
        border: "none",
      },
    },

    //  Input real (texto)
    "& .MuiInputBase-input": {
      padding: "12px 14px",
      fontSize: "0.875rem",
      fontWeight: disabled ? 400 : 500,
      color: disabled
        ? theme.palette.text.secondary
        : theme.palette.text.primary,
      cursor: readonly ? "not-allowed" : "text",
    },

    // ADORNMENTS / SELECT
    "& .MuiInputAdornment-root": {
      color: disabled
        ? theme.palette.text.secondary
        : theme.palette.primary.light,
      marginRight: theme.spacing(1),
    },

    "& .MuiSelect-select": {
      paddingRight: `${theme.spacing(4)} !important`,
    },

    "& .MuiSelect-icon": {
      color: disabled
        ? theme.palette.text.secondary
        : theme.palette.primary.light,
    },
  };
});
