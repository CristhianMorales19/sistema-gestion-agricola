// src/shared/components/ConfirmDeleteDialog.tsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton,
    Slide
    } from '@mui/material';
    import { TransitionProps } from '@mui/material/transitions';
    import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

    const Transition = React.forwardRef(function Transition(
        props: TransitionProps & { children: React.ReactElement },
        ref: React.Ref<unknown>,
        ) {
            return <Slide direction="up" ref={ref} {...props} />;
    });

    type ConfirmDeleteDialogProps = {
        open: boolean;
        title?: string;
        message?: string;
        itemLabel?: string; // ejemplo: "Cuadrilla ABC"
        onCancel: () => void;
        onConfirm: () => Promise<void> | void;
        loading?: boolean;
    };

    export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
        open,
        title = 'Confirmar eliminación',
        message = '¿Estás seguro que deseas eliminar este elemento? Esta acción no se puede deshacer.',
        itemLabel,
        onCancel,
        onConfirm,
        loading = false,
    }) => {
        return (
            <Dialog
                    open={open}
                    onClose={onCancel}
                    TransitionComponent={Transition}
                    aria-labelledby="confirm-delete-title"
                    maxWidth="xs"
                    fullWidth
                    PaperProps={{
                        sx: {
                            backgroundColor: '#0f172a', // fondo oscuro
                            color: '#ffffff', // texto blanco
                            border: '1px solid #334155',
                            borderRadius: 2,
                            boxShadow: '0px 0px 15px rgba(0,0,0,0.8)',
                        },
                    }}
                >
                <DialogTitle id="confirm-delete-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteOutlineIcon sx={{ color: '#ef4444' }} />
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">{title}</Typography>
                        <IconButton aria-label="close" onClick={onCancel} size="small">
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        {message}
                    </Typography>
                        {itemLabel && (
                        <Typography variant="body1" sx={{ backgroundColor: '#0f172a', borderRadius: 1 }}>
                            {itemLabel}
                    </Typography>
                    )}
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onCancel} variant="outlined" disabled={loading}>
                    Cancelar
                    </Button>
                        <Button
                            onClick={() => onConfirm()}
                            variant="contained"
                            disabled={loading}
                            sx={{
                                backgroundColor: '#ef4444',
                                '&:hover': { backgroundColor: '#dc2626' },
                                ml: 1
                            }}
                            >
                                {loading ? 'Eliminando...' : 'Eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>
        );
};
