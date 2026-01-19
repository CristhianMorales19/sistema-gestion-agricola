import { Warning } from "@mui/icons-material";
import {
  GlassDialog,
  GlassDialogTitle,
  DeleteIcon,
  GlassDialogContent,
  ItemLabel,
  ItemLabelText,
  GlassDialogActions,
  DeleteButton,
  ButtonText,
  WarningContainer,
  WarningText,
  SlideTransition,
  WarningIcon,
} from "./ConfirmDeleteDialog.styles";
import { TextGeneric } from "../../../styles/Text.styles";
import { BackButtonGeneric } from "../../../styles/BackButton.styles";

interface ConfirmDeleteDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  itemLabel?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export const ConfirmDeleteDialog = ({
  open,
  title = "Confirmar eliminación",
  message = "¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.",
  itemLabel,
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmDeleteDialogProps) => {
  return (
    <GlassDialog
      open={open}
      onClose={onCancel}
      TransitionComponent={SlideTransition}
      aria-labelledby="confirm-delete-title"
      maxWidth="xs"
      fullWidth
    >
      <GlassDialogTitle id="confirm-delete-title">
        <DeleteIcon />
        <TextGeneric variant="h6">{title}</TextGeneric>
      </GlassDialogTitle>

      <GlassDialogContent dividers>
        <WarningContainer>
          <WarningIcon as={Warning} />
          <WarningText>{message}</WarningText>
        </WarningContainer>

        {itemLabel && (
          <ItemLabel>
            <ItemLabelText variant="body1">{itemLabel}</ItemLabelText>
          </ItemLabel>
        )}
      </GlassDialogContent>

      <GlassDialogActions>
        <BackButtonGeneric
          onClick={onCancel}
          variant="outlined"
          disabled={loading}
          fullWidth
        >
          Cancelar
        </BackButtonGeneric>
        <DeleteButton
          onClick={() => onConfirm()}
          variant="contained"
          disabled={loading}
          loading={loading}
          fullWidth
        >
          <ButtonText>{loading ? "Eliminando..." : "Eliminar"}</ButtonText>
        </DeleteButton>
      </GlassDialogActions>
    </GlassDialog>
  );
};
