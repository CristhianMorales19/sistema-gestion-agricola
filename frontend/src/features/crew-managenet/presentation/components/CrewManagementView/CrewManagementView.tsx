import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    InputAdornment,
    } from '@mui/material';
    import {
    Search as SearchIcon,
    GroupAdd as GroupAddIcon,
    } from '@mui/icons-material';
    import { CrewTable } from '../CrewTable/CrewTable';
    import { NewCrewForm, NewCrewFormData } from '../CrewForm/NewCrewForm';
    import { UseCrewManagement } from '../../../application/hooks/UseCrewManagement';
    import { CreateCrewData, Crew } from '../../../domain/entities/Crew';
    import { useEmployeeManagement } from '../../../../personnel-management/application/hooks/useEmployeeManagement';

    type CrewView = 'list' | 'new-crew' | 'edit-crew';

    export const CrewManagementView: React.FC = () => {
    const { crews, loading, error, fetchCrews, searchCrews} = UseCrewManagement();
    const { employees, refreshEmployees } = useEmployeeManagement();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [currentView, setCurrentView] = useState<CrewView>('list');
    const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

    // Fetch crews on component mount
    useEffect(() => {
        fetchCrews();
        refreshEmployees();
    }, [fetchCrews, refreshEmployees]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        if (searchQuery.trim().length > 0) {
            setIsSearching(true);
            await searchCrews(searchQuery.trim());
        }
    };

    const handleClearSearch = async () => {
        setSearchQuery('');
        setIsSearching(false);
        setSelectedCrew(null);
        await fetchCrews();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
        handleSearch();
        }
    };

    const handleAddCrewClick = useCallback(() => {
        setCurrentView('new-crew');
        setSelectedCrew(null);
    }, []);

    const handleEditCrew = useCallback((crew: Crew) => {
        setSelectedCrew(crew);
        setCurrentView('edit-crew');
    }, []);

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedCrew(null);
        fetchCrews();
    };

    const handleCreateCrew = async (data: CreateCrewData) => {
        // try {
        // await createCrew(data);
        // await fetchCrews();
        // } catch (err) {
        // console.error('Error creating crew:', err);
        // throw err;
        // }
    };

    const handleUpdateCrew = async (data: CreateCrewData) => {
        // if (!selectedCrew) throw new Error('No crew selected for update');
        // try {
        // await updateCrew(selectedCrew.id, data);
        // await fetchCrews();
        // } catch (err) {
        // console.error('Error updating crew:', err);
        // throw err;
        // }
    };

    // const handleDelete = useCallback(async (id: string) => {
    //     if (window.confirm('Are you sure you want to delete this crew?')) {
    //     try {
    //         await deleteCrew(id);
    //         if (selectedCrew && selectedCrew.id === id) {
    //         setSelectedCrew(null);
    //         }
    //         await fetchCrews();
    //     } catch (err) {
    //         console.error('Error deleting crew:', err);
    //     }
    //     }
    // }, [deleteCrew, selectedCrew, fetchCrews]);

    // Render content based on current view
    const renderContent = () => {
        switch (currentView) {
        case 'new-crew':
            return (
            <NewCrewForm
                onSubmit={handleCreateCrew}
                onCancel={handleBackToList}
                employees={employees}
            />
            );

        case 'edit-crew':
            return (
            <NewCrewForm
                onSubmit={handleUpdateCrew}
                onCancel={handleBackToList}
                employees={employees}
                initialData={selectedCrew ? {
                    code: selectedCrew.code,
                    description: selectedCrew.description,
                    workArea: selectedCrew.workArea,
                    workers: selectedCrew.workers.map(worker => worker.id)
                } : undefined}
            />
            );

        case 'list':
        default:
            return (
            <>
                {/* Search Bar */}
                <Paper sx={{ p: 2, mb: 3, backgroundColor: '#1e293b', border: '1px solid #334155' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                        fullWidth
                        placeholder="Buscar por codigo o area de trabajo"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                        InputProps={{
                            startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                            ),
                            sx: { color: '#ffffff' }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#475569' },
                            '&:hover fieldset': { borderColor: '#64748b' },
                            '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                            }
                        }}
                        />
                        <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={searchQuery.trim().length === 0}
                        sx={{
                            minWidth: '100px',
                            backgroundColor: '#6366f1',
                            '&:hover': { backgroundColor: '#4f46e5' },
                            '&:disabled': { backgroundColor: '#475569' }
                        }}
                        >
                        Buscar
                        </Button>
                        {isSearching && (
                        <Button
                            variant="outlined"
                            onClick={handleClearSearch}
                            sx={{
                            minWidth: '100px',
                            color: '#94a3b8',
                            borderColor: '#475569',
                            '&:hover': {
                                color: '#ffffff',
                                borderColor: '#64748b',
                                backgroundColor: '#334155'
                            }
                            }}
                        >
                            Limpiar
                        </Button>
                        )}
                    </Box>
                </Paper>

                {/* Contenido dinámico: loading / sin resultados / tabla */}
                {loading ? (
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            textAlign: 'center',
                            mt: 5
                        }}
                    >
                        Buscando cuadrillas...
                    </Typography>
                ) : crews.length === 0 ? (
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            textAlign: 'center',
                            mt: 5
                        }}
                    >
                        {isSearching
                            ? `No se encontraron resultados para "${searchQuery}"`
                            : 'No hay cuadrillas registradas aún.'}
                    </Typography>
                ) : (
                    <CrewTable
                        crews={crews}
                        onEdit={handleEditCrew}
                        // onDelete={handleDelete}
                    />
                )}
            </>
            );
        }
    };

    return (
        <Box sx={{ p: 3 }}>
        {/* Header - Always visible */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
            Gestión de Cuadrillas
            </Typography>
            
            {/* Show buttons only in list view */}
            {currentView === 'list' && (
            <Button
                variant="contained"
                startIcon={<GroupAddIcon />}
                onClick={handleAddCrewClick}
                sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
                }}
            >
                Crear Cuadrilla
            </Button>
            )}
        </Box>

        {/* Dynamic content */}
        {renderContent()}
        </Box>
    );
};