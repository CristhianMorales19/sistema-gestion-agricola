// src/features/parcel-management/presentation/components/ParcelManagementView/ParcelManagementView.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  Chip,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckCircleIcon,
  Grass as GrassIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Landscape as LandscapeIcon
} from '@mui/icons-material';
import { NewParcelForm } from '../ParcelForm/NewParcelForm';
import { EditParcelDialog } from '../ParcelForm/EditParcelDialog';
import { useParcelManagement } from '../../../application/hooks/useParcelManagement';
import { CreateParcelDTO, UpdateParcelDTO, Parcel } from '../../../domain/entities/Parcel';
import { ParcelService } from '../../../application/ParcelService';

type ParcelView = 'list' | 'new-parcel';

interface SelectedParcel {
  id: number;
  nombre: string;
}

// Colores del tema
const colors = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceLight: '#334155',
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  border: '#475569'
};

// Componente de Stats Card
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}> = ({ title, value, icon, color, subtitle }) => (
  <Card sx={{ 
    backgroundColor: colors.surface, 
    border: `1px solid ${colors.surfaceLight}`,
    height: '100%',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 20px ${color}20`
    }
  }}>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1, fontSize: '0.875rem' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ color: colors.textPrimary, fontWeight: 700, mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{ 
          backgroundColor: `${color}20`,
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {React.cloneElement(icon as React.ReactElement, { sx: { color, fontSize: 28 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Mapa de colores para tipos de terreno
const TERRAIN_COLORS: Record<string, string> = {
  'plano': '#10b981',
  'inclinado': '#3b82f6',
  'mixto': '#f59e0b',
  'otro': '#8b5cf6',
  'arenoso': '#ec4899',
  'arcilloso': '#06b6d4',
  'sin_especificar': '#6b7280'
};

// Componente de distribución por tipo de terreno
const TerrainDistribution: React.FC<{ parcels: Parcel[] }> = ({ parcels }) => {
  const distribution = useMemo(() => {
    const counts: Record<string, { count: number; area: number; color: string }> = {};

    parcels.forEach(p => {
      // Usar tipoTerrenoEfectivo si existe, sino tipoTerreno, sino tipoTerrenoOtro
      const tipo = p.tipoTerrenoEfectivo || p.tipoTerreno || p.tipoTerrenoOtro || 'sin_especificar';
      const tipoNormalizado = tipo.toLowerCase().replace(/\s+/g, '_');
      if (!counts[tipoNormalizado]) {
        counts[tipoNormalizado] = { count: 0, area: 0, color: TERRAIN_COLORS[tipoNormalizado] || '#8b5cf6' };
      }
      counts[tipoNormalizado].count++;
      counts[tipoNormalizado].area += p.areaHectareas || 0;
    });

    return Object.entries(counts).map(([tipo, data]) => ({
      tipo,
      label: ParcelService.getTipoTerrenoLabel(tipo as any, null),
      ...data,
      percentage: parcels.length > 0 ? (data.count / parcels.length) * 100 : 0
    }));
  }, [parcels]);

  const totalArea = parcels.reduce((sum, p) => sum + (p.areaHectareas || 0), 0);

  return (
    <Card sx={{ 
      backgroundColor: colors.surface, 
      border: `1px solid ${colors.surfaceLight}`,
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 3, fontWeight: 600 }}>
          Distribución por Tipo de Terreno
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {distribution.map(({ tipo, label, count, area, color, percentage }) => (
            <Box key={tipo}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: color }} />
                  <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                    {label}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                  {count} ({percentage.toFixed(0)}%) • {area.toFixed(2)} ha
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: `${color}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                    borderRadius: 4
                  }
                }}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${colors.surfaceLight}` }}>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            Área total: <strong style={{ color: colors.textPrimary }}>{totalArea.toFixed(2)} hectáreas</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente de fila de parcela mejorado
const ParcelRow: React.FC<{
  parcel: Parcel;
  isSelected: boolean;
  onEdit: (parcel: Parcel) => void;
  onDelete: (id: number) => void;
  onSelect: (parcel: Parcel) => void;
}> = React.memo(({ parcel, isSelected, onEdit, onDelete, onSelect }) => {
  const handleRowClick = useCallback(() => onSelect(parcel), [parcel, onSelect]);
  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(parcel);
  }, [parcel, onEdit]);
  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (parcel.id) onDelete(parcel.id);
  }, [parcel.id, onDelete]);

  return (
    <Paper
      onClick={handleRowClick}
      sx={{
        p: 2,
        mb: 1.5,
        backgroundColor: isSelected ? colors.surfaceLight : colors.surface,
        border: `1px solid ${isSelected ? colors.primary : colors.surfaceLight}`,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          backgroundColor: colors.surfaceLight,
          transform: 'translateX(4px)'
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Icono y Nombre */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              backgroundColor: `${colors.primary}20`,
              borderRadius: '50%',
              p: 1,
              display: 'flex'
            }}>
              <LocationIcon sx={{ color: colors.primary }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                {parcel.nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', maxWidth: 250 }} noWrap>
                {parcel.descripcion || 'Sin descripción'}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Ubicación */}
        <Grid item xs={12} md={3}>
          <Typography variant="body2" sx={{ color: colors.textSecondary }}>
            {parcel.ubicacionDescripcion || 'Sin ubicación'}
          </Typography>
        </Grid>

        {/* Área */}
        <Grid item xs={6} md={1}>
          <Typography variant="body1" sx={{ color: colors.textPrimary, fontWeight: 600, textAlign: 'center' }}>
            {parcel.areaHectareas?.toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'block', textAlign: 'center' }}>
            ha
          </Typography>
        </Grid>

        {/* Tipo Terreno */}
        <Grid item xs={6} md={2}>
          {(() => {
            const tipo = (parcel.tipoTerrenoEfectivo || parcel.tipoTerreno || parcel.tipoTerrenoOtro || 'otro').toLowerCase().replace(/\s+/g, '_');
            const terrainColor = TERRAIN_COLORS[tipo] || '#8b5cf6';
            return (
              <Chip 
                label={ParcelService.getTipoTerrenoLabel(parcel.tipoTerreno, parcel.tipoTerrenoOtro)}
                size="small"
                sx={{
                  backgroundColor: `${terrainColor}20`,
                  color: terrainColor,
                  fontWeight: 500
                }}
              />
            );
          })()}
        </Grid>

        {/* Estado */}
        <Grid item xs={6} md={1}>
          <Chip 
            label={ParcelService.getEstadoLabel(parcel.estado)}
            size="small"
            sx={{
              backgroundColor: `${ParcelService.getEstadoColor(parcel.estado)}20`,
              color: ParcelService.getEstadoColor(parcel.estado),
              fontWeight: 500
            }}
          />
        </Grid>

        {/* Acciones */}
        <Grid item xs={6} md={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Editar">
              <IconButton 
                size="small" 
                onClick={handleEditClick}
                sx={{ 
                  color: colors.primary,
                  '&:hover': { backgroundColor: `${colors.primary}20` }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton 
                size="small" 
                onClick={handleDeleteClick}
                sx={{ 
                  color: colors.danger,
                  '&:hover': { backgroundColor: `${colors.danger}20` }
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
});

ParcelRow.displayName = 'ParcelRow';

export const ParcelManagementView: React.FC = () => {
  const { parcels, loading, deleteParcel, searchParcels, refreshParcels, createParcel, updateParcel } = useParcelManagement();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<ParcelView>('list');
  const [selectedParcel, setSelectedParcel] = useState<SelectedParcel | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parcelToDelete, setParcelToDelete] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingParcel, setEditingParcel] = useState<Parcel | null>(null);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalParcelas = parcels.length;
    // Contar como activas: estado 'activo', 'disponible', o sin estado (default es disponible)
    const parcelasActivas = parcels.filter(p => 
      !p.estado || p.estado === 'activo' || p.estado === 'disponible'
    ).length;
    const areaTotal = parcels.reduce((sum, p) => sum + (p.areaHectareas || 0), 0);
    return { totalParcelas, parcelasActivas, areaTotal };
  }, [parcels]);

  useEffect(() => {
    refreshParcels();
  }, [refreshParcels]);

  // Búsqueda dinámica
  useEffect(() => {
    if (currentView !== 'list') return;
    const handle = window.setTimeout(() => {
      searchParcels(searchQuery);
    }, 250);
    return () => window.clearTimeout(handle);
  }, [searchQuery, searchParcels, currentView]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    await searchParcels(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleAddParcelClick = useCallback(() => {
    setCurrentView('new-parcel');
    setSelectedParcel(null);
  }, []);

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedParcel(null);
    refreshParcels();
  };

  const handleCreateParcel = async (data: CreateParcelDTO) => {
    return await createParcel(data);
  };

  const handleEdit = useCallback((parcel: Parcel) => {
    if (parcel.id) {
      setEditingParcel(parcel);
      setEditDialogOpen(true);
    }
  }, []);

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingParcel(null);
  };

  const handleUpdateParcel = async (id: number, data: UpdateParcelDTO) => {
    const success = await updateParcel(id, data);
    if (success) {
      await refreshParcels();
    }
    return success;
  };

  const handleDelete = useCallback(async (id: number) => {
    setParcelToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (parcelToDelete) {
      await deleteParcel(parcelToDelete);
      if (selectedParcel && selectedParcel.id === parcelToDelete) setSelectedParcel(null);
      await refreshParcels();
      setDeleteDialogOpen(false);
      setParcelToDelete(null);
    }
  }, [parcelToDelete, deleteParcel, selectedParcel, refreshParcels]);

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setParcelToDelete(null);
  };

  const handleParcelSelect = useCallback((parcel: Parcel) => {
    if (parcel.id) {
      setSelectedParcel({ id: parcel.id, nombre: parcel.nombre });
    }
  }, []);

  // Renderizar contenido
  const renderContent = () => {
    switch (currentView) {
      case 'new-parcel':
        return (
          <NewParcelForm
            onSubmit={handleCreateParcel}
            onCancel={handleBackToList}
          />
        );

      case 'list':
      default:
        return (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Total de Parcelas"
                  value={stats.totalParcelas}
                  icon={<LocationIcon />}
                  color={colors.primary}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Parcelas Activas"
                  value={stats.parcelasActivas}
                  icon={<CheckCircleIcon />}
                  color={colors.success}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <StatsCard
                  title="Área Total"
                  value={`${stats.areaTotal.toFixed(1)} ha`}
                  icon={<GrassIcon />}
                  color={colors.warning}
                />
              </Grid>
            </Grid>

            {/* Gráfico de distribución + Búsqueda */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={5}>
                <TerrainDistribution parcels={parcels} />
              </Grid>
              <Grid item xs={12} md={7}>
                <Card sx={{ 
                  backgroundColor: colors.surface, 
                  border: `1px solid ${colors.surfaceLight}`,
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: colors.textPrimary, mb: 3, fontWeight: 600 }}>
                      Buscar Parcelas
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        fullWidth
                        placeholder="Buscar por nombre, ubicación o tipo de terreno..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: colors.textSecondary }} />
                            </InputAdornment>
                          ),
                          sx: { color: colors.textPrimary }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: colors.border },
                            '&:hover fieldset': { borderColor: colors.textSecondary },
                            '&.Mui-focused fieldset': { borderColor: colors.primary }
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{
                          minWidth: '100px',
                          backgroundColor: colors.primary,
                          '&:hover': { backgroundColor: '#2563eb' }
                        }}
                      >
                        Buscar
                      </Button>
                    </Box>
                    
                    {/* Resumen rápido */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<LandscapeIcon />}
                        label={`${parcels.length} parcelas encontradas`}
                        sx={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                      />
                      {selectedParcel && (
                        <Chip 
                          label={`Seleccionada: ${selectedParcel.nombre}`}
                          onDelete={() => setSelectedParcel(null)}
                          sx={{ backgroundColor: `${colors.success}20`, color: colors.success }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Lista de Parcelas - Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 2,
              pb: 2,
              borderBottom: `1px solid ${colors.surfaceLight}`
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                  Lista de Parcelas
                </Typography>
                <Chip 
                  label={parcels.length}
                  size="small"
                  sx={{ backgroundColor: colors.primary, color: colors.textPrimary }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                Mostrando {parcels.length} de {stats.totalParcelas} parcelas
              </Typography>
            </Box>

            {/* Header de columnas */}
            <Paper sx={{ 
              p: 2, 
              mb: 1, 
              backgroundColor: colors.surfaceLight,
              borderRadius: 2
            }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                    Parcela
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                    Ubicación
                  </Typography>
                </Grid>
                <Grid item xs={6} md={1}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', textAlign: 'center', display: 'block' }}>
                    Área (ha)
                  </Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                    Tipo de Terreno
                  </Typography>
                </Grid>
                <Grid item xs={6} md={1}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                    Estado
                  </Typography>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Typography variant="caption" sx={{ color: colors.textSecondary, fontWeight: 600, textTransform: 'uppercase', textAlign: 'right', display: 'block' }}>
                    Acciones
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Lista de Parcelas */}
            {parcels.length === 0 ? (
              <Paper sx={{ 
                p: 6, 
                backgroundColor: colors.surface, 
                border: `1px solid ${colors.surfaceLight}`,
                textAlign: 'center',
                borderRadius: 2
              }}>
                <LandscapeIcon sx={{ fontSize: 48, color: colors.textSecondary, mb: 2 }} />
                <Typography sx={{ color: colors.textSecondary }}>
                  No hay parcelas registradas
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddParcelClick}
                  sx={{ mt: 2, backgroundColor: colors.success }}
                >
                  Crear Primera Parcela
                </Button>
              </Paper>
            ) : (
              <Box>
                {parcels.map((parcel) => (
                  <ParcelRow
                    key={parcel.id}
                    parcel={parcel}
                    isSelected={selectedParcel?.id === parcel.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSelect={handleParcelSelect}
                  />
                ))}
              </Box>
            )}
          </>
        );
    }
  };

  if (loading && currentView === 'list') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: colors.background }}>
        <Typography sx={{ color: colors.textPrimary }}>Cargando parcelas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: colors.background }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: colors.background,
        p: 3,
        borderBottom: `1px solid ${colors.surfaceLight}`,
        flexShrink: 0
      }}>
        <Box>
          <Typography variant="h4" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
            Gestión de Parcelas
          </Typography>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
            Administra las parcelas de trabajo para asignar labores y personal
          </Typography>
        </Box>
        
        {currentView === 'list' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddParcelClick}
            sx={{
              backgroundColor: colors.success,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              '&:hover': { backgroundColor: '#059669' }
            }}
          >
            Nueva Parcela
          </Button>
        )}
      </Box>

      {/* Contenido principal */}
      <Box sx={{ p: 3, overflowY: 'auto', flex: 1 }}>
        {renderContent()}
      </Box>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        PaperProps={{
          sx: {
            backgroundColor: colors.surface,
            borderRadius: 2,
            border: `1px solid ${colors.surfaceLight}`,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: colors.textPrimary, fontWeight: 600 }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: colors.textSecondary }}>
            ¿Está seguro de que desea eliminar esta parcela? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: colors.textSecondary,
              '&:hover': { backgroundColor: colors.surfaceLight }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: colors.danger,
              '&:hover': { backgroundColor: '#dc2626' }
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de edición de parcela */}
      <EditParcelDialog
        open={editDialogOpen}
        parcel={editingParcel}
        onClose={handleCloseEditDialog}
        onSave={handleUpdateParcel}
      />
    </Box>
  );
};
