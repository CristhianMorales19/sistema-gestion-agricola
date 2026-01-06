// src/absence-management/presentation/components/AbsenceManagementView/AbsenceManagementView.tsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardMedia
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Assessment as StatsIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { RegistrarAusencia } from '../RegistrarAusencia';
import { AbsenceTable } from '../AbsenceTable';
import { DocumentViewer } from '../DocumentViewer';
import { useAbsenceManagement } from '../../../application/hooks/useAbsenceManagement';
import { CreateAbsenceData, Absence } from '../../../domain/entities/Absence';

type ViewMode = 'list' | 'register';

export const AbsenceManagementView: React.FC = () => {
  const {
    absences,
    loading,
    error,
    successMessage,
    stats,
    registerAbsence,
    deleteAbsence,
    approveAbsence,
    rejectAbsence,
    uploadDocument,
    refreshAbsences,
    clearMessages
  } = useAbsenceManagement();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<string | null>(null);

  /**
   * Manejar registro de nueva ausencia
   */
  const handleRegisterAbsence = useCallback(async (data: CreateAbsenceData, documento?: File) => {
    try {
      const newAbsence = await registerAbsence(data);
      
      // Si hay documento, subirlo (verificación estricta)
      if (documento && documento instanceof File && newAbsence.id) {
        console.log('📎 Subiendo documento:', documento.name, documento.size);
        await uploadDocument(newAbsence.id, documento);
      } else {
        console.log('📝 No hay documento para subir o ausencia sin ID');
      }
      
      setViewMode('list');
    } catch (error) {
      console.error('Error al registrar ausencia:', error);
    }
  }, [registerAbsence, uploadDocument]);

  /**
   * Manejar búsqueda
   */
  const handleSearch = useCallback(async () => {
    // Por ahora, simplemente refresca los datos
    // TODO: Implementar filtros más específicos
    await refreshAbsences();
  }, [refreshAbsences]);

  /**
   * Manejar aprobación
   */
  const handleApprove = useCallback(async (id: string) => {
    try {
      // TODO: Obtener supervisor_id del contexto de autenticación
      const supervisorId = 1; // Temporal
      await approveAbsence(id, supervisorId, 'Aprobado');
    } catch (error) {
      console.error('Error al aprobar ausencia:', error);
    }
  }, [approveAbsence]);

  /**
   * Manejar rechazo
   */
  const handleReject = useCallback(async (id: string) => {
    try {
      // TODO: Obtener supervisor_id del contexto de autenticación
      const supervisorId = 1; // Temporal
      await rejectAbsence(id, supervisorId, 'Rechazado');
    } catch (error) {
      console.error('Error al rechazar ausencia:', error);
    }
  }, [rejectAbsence]);

  /**
   * Manejar eliminación
   */
  const handleDeleteClick = useCallback((id: string) => {
    setAbsenceToDelete(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (absenceToDelete) {
      try {
        await deleteAbsence(absenceToDelete);
        setShowDeleteConfirm(false);
        setAbsenceToDelete(null);
      } catch (error) {
        console.error('Error al eliminar ausencia:', error);
      }
    }
  }, [absenceToDelete, deleteAbsence]);

  /**
   * Manejar vista de detalles
   */
  const handleViewDetails = useCallback((absence: Absence) => {
    setSelectedAbsence(absence);
    setShowDetailsDialog(true);
  }, []);

  /**
   * Manejar vista de documento
   */
  const handleViewDocument = useCallback((absence: Absence) => {
    // Ya no se usa - el documento se ve en detalles
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
          Gestión de Ausencias Justificadas
        </Typography>
        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
          Registra y administra las ausencias justificadas del personal
        </Typography>
      </Box>

      {/* Estadísticas */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Total Ausencias
                    </Typography>
                  </Box>
                  <StatsIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#fbbf24', fontWeight: 'bold' }}>
                      {stats.pendientes}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Pendientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                      {stats.aprobadas}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Aprobadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                      {stats.rechazadas}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      Rechazadas
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Mensajes de Feedback */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={clearMessages}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={clearMessages} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={clearMessages}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={clearMessages} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Vista Principal */}
      {viewMode === 'list' ? (
        <>
          {/* Barra de Acciones */}
          <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                placeholder="Buscar ausencias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#94a3b8' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  flexGrow: 1,
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#334155',
                    color: '#ffffff',
                    '& fieldset': { borderColor: '#475569' }
                  }
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setViewMode('register')}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
              >
                Nueva Ausencia
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={refreshAbsences}
                sx={{
                  color: '#94a3b8',
                  borderColor: '#475569',
                  '&:hover': { borderColor: '#64748b' }
                }}
              >
                Actualizar
              </Button>
            </Box>
          </Paper>

          {/* Tabla de Ausencias */}
          <AbsenceTable
            absences={absences}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDeleteClick}
            onView={handleViewDetails}
            showActions
          />
        </>
      ) : (
        <RegistrarAusencia
          onSubmit={handleRegisterAbsence}
          onCancel={() => setViewMode('list')}
          loading={loading}
        />
      )}

      {/* Diálogo de Detalles */}
      <Dialog
        open={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
          Detalles de la Ausencia
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b', color: '#ffffff', mt: 2 }}>
          {selectedAbsence && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Trabajador:</Typography>
                <Typography>{selectedAbsence.trabajador_nombre}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Documento:</Typography>
                <Typography>{selectedAbsence.trabajador_documento}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Fecha de Ausencia:</Typography>
                <Typography>{new Date(selectedAbsence.fecha_ausencia).toLocaleDateString()}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Motivo:</Typography>
                <Typography>{selectedAbsence.motivo_personalizado || selectedAbsence.motivo}</Typography>
              </Box>
              {selectedAbsence.comentarios && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Comentarios:</Typography>
                  <Typography>{selectedAbsence.comentarios}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Estado:</Typography>
                <Typography>{selectedAbsence.estado}</Typography>
              </Box>

              {/* Documentación de Respaldo */}
              {selectedAbsence.documentacion_respaldo && (
                <Box sx={{ borderTop: '1px solid #475569', pt: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 2 }}>
                    Documentación de Respaldo:
                  </Typography>
                  <DocumentViewer
                    absenceId={selectedAbsence.id}
                    documentPath={selectedAbsence.documentacion_respaldo}
                    onError={(error) => {
                      console.error('Error loading document:', error);
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b' }}>
          <Button onClick={() => setShowDetailsDialog(false)} sx={{ color: '#94a3b8' }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Confirmación de Eliminación */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle sx={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e293b', color: '#ffffff', mt: 2 }}>
          <Typography>
            ¿Está seguro que desea eliminar este registro de ausencia?
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e293b' }}>
          <Button
            onClick={() => setShowDeleteConfirm(false)}
            sx={{ color: '#94a3b8' }}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{ color: '#ef4444' }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
