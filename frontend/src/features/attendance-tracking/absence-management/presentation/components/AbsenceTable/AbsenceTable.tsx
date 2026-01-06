// src/absence-management/presentation/components/AbsenceTable/AbsenceTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Typography
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Description as DocumentIcon
} from '@mui/icons-material';
import { Absence } from '../../../domain/entities/Absence';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AbsenceTableProps {
  absences: Absence[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (absence: Absence) => void;
  showActions?: boolean;
  loading?: boolean;
}

const getStatusColor = (estado: string): 'default' | 'success' | 'error' | 'warning' => {
  switch (estado) {
    case 'aprobada':
      return 'success';
    case 'rechazada':
      return 'error';
    case 'pendiente':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusLabel = (estado: string): string => {
  switch (estado) {
    case 'aprobada':
      return 'Aprobada';
    case 'rechazada':
      return 'Rechazada';
    case 'pendiente':
      return 'Pendiente';
    default:
      return estado;
  }
};

const formatDate = (date: Date | string): string => {
  try {
    return format(new Date(date), 'dd MMM yyyy', { locale: es });
  } catch {
    return 'Fecha inválida';
  }
};

const getMotivoLabel = (motivo: string, motivoPersonalizado?: string): string => {
  if (motivo === 'otro' && motivoPersonalizado) {
    return motivoPersonalizado;
  }
  
  const motivos: Record<string, string> = {
    enfermedad: 'Enfermedad',
    cita_medica: 'Cita médica',
    permiso_personal: 'Permiso personal',
    emergencia_familiar: 'Emergencia familiar',
    incapacidad: 'Incapacidad médica',
    duelo: 'Duelo',
    matrimonio: 'Matrimonio',
    paternidad_maternidad: 'Paternidad/Maternidad'
  };
  
  return motivos[motivo] || motivo;
};

export const AbsenceTable: React.FC<AbsenceTableProps> = ({
  absences,
  onApprove,
  onReject,
  onDelete,
  onView,
  onViewDocument,
  showActions = true,
  loading = false
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography sx={{ color: '#94a3b8' }}>Cargando ausencias...</Typography>
      </Box>
    );
  }

  if (absences.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#94a3b8' }}>
          No se encontraron registros de ausencias
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#334155' }}>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Trabajador</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Documento</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Fecha Ausencia</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Motivo</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Estado</TableCell>
            <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Supervisor</TableCell>
            {showActions && (
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', textAlign: 'center' }}>
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {absences.map((absence) => (
            <TableRow
              key={absence.id}
              sx={{
                '&:hover': { backgroundColor: '#334155' },
                backgroundColor: '#1e293b'
              }}
            >
              <TableCell sx={{ color: '#ffffff' }}>
                {absence.trabajador_nombre}
              </TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>
                {absence.trabajador_documento}
              </TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>
                {formatDate(absence.fecha_ausencia)}
              </TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>
                {getMotivoLabel(absence.motivo, absence.motivo_personalizado)}
              </TableCell>
              <TableCell>
                <Chip
                  label={getStatusLabel(absence.estado)}
                  color={getStatusColor(absence.estado)}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </TableCell>
              <TableCell sx={{ color: '#94a3b8' }}>
                {absence.supervisor_nombre || '-'}
              </TableCell>
              {showActions && (
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    {onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton
                          size="small"
                          onClick={() => onView(absence)}
                          sx={{ color: '#3b82f6' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onApprove && absence.estado === 'pendiente' && (
                      <Tooltip title="Aprobar">
                        <IconButton
                          size="small"
                          onClick={() => onApprove(absence.id)}
                          sx={{ color: '#10b981' }}
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onReject && absence.estado === 'pendiente' && (
                      <Tooltip title="Rechazar">
                        <IconButton
                          size="small"
                          onClick={() => onReject(absence.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onDelete && absence.estado === 'pendiente' && (
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          onClick={() => onDelete(absence.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
