import React, { useState, useEffect, useCallback } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { LoginOutlined as EntryIcon, LogoutOutlined as ExitIcon } from '@mui/icons-material';
import { Worker, RegisterEntryData, RegisterExitData, AttendanceRecord } from '../../../domain/entities/Attendance';

interface AttendanceRegistrationProps {
  workers: Worker[];
  loading: boolean;
  onRegisterEntry: (data: RegisterEntryData) => Promise<boolean>;
  onRegisterExit: (attendanceId: number, data: RegisterExitData) => Promise<boolean>;
  getWorkerActiveEntry: (workerId: number) => Promise<AttendanceRecord | null>;
}

export const AttendanceRegistration: React.FC<AttendanceRegistrationProps> = ({
  workers,
  loading,
  onRegisterEntry,
  onRegisterExit,
  getWorkerActiveEntry,
}) => {
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | ''>('');
  const [entryTime, setEntryTime] = useState(getCurrentTime());
  const [exitTime, setExitTime] = useState(getCurrentTime());
  const [notes, setNotes] = useState('');
  const [activeEntry, setActiveEntry] = useState<AttendanceRecord | null>(null);
  const [registering, setRegistering] = useState(false);

  function getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    setEntryTime(getCurrentTime());
    setExitTime(getCurrentTime());
  }, []);

  const checkActiveEntry = useCallback(async (workerId: number) => {
    const entry = await getWorkerActiveEntry(workerId);
    setActiveEntry(entry);
  }, [getWorkerActiveEntry]);

  useEffect(() => {
    if (selectedWorkerId !== '') {
      checkActiveEntry(selectedWorkerId as number);
    }
  }, [selectedWorkerId, checkActiveEntry]);

  const handleRegisterEntry = async () => {
    if (selectedWorkerId === '') return;

    setRegistering(true);
    const success = await onRegisterEntry({
      trabajador_id: selectedWorkerId as number,
      horaEntrada: entryTime,
    });
    setRegistering(false);

    if (success) {
      setSelectedWorkerId('');
      setEntryTime(getCurrentTime());
      setNotes('');
      setActiveEntry(null);
    }
  };

  const handleRegisterExit = async () => {
    if (!activeEntry) return;

    setRegistering(true);
    const success = await onRegisterExit(activeEntry.asistencia_id, {
      trabajador_id: activeEntry.trabajador_id,
      horaSalida: exitTime,
      observacion: notes || undefined,
    });
    setRegistering(false);

    if (success) {
      setSelectedWorkerId('');
      setExitTime(getCurrentTime());
      setNotes('');
      setActiveEntry(null);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Attendance Registration
      </Typography>

      <Grid container spacing={2}>
        {/* Worker Selection */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Select Worker</InputLabel>
            <Select
              value={selectedWorkerId}
              label="Select Worker"
              onChange={(e) => setSelectedWorkerId(e.target.value as number | '')}
              disabled={loading || registering}
            >
              <MenuItem value="">-- Choose Worker --</MenuItem>
              {workers.map((worker) => (
                <MenuItem key={worker.trabajador_id} value={worker.trabajador_id}>
                  {worker.documento_identidad} - {worker.nombre_completo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Display */}
        {selectedWorkerId !== '' && (
          <Grid item xs={12} sm={6}>
            {activeEntry ? (
              <Alert severity="warning">
                Active entry at {activeEntry.hora_entrada_at?.substring(0, 5)} - Ready to exit
              </Alert>
            ) : (
              <Alert severity="info">No active entry - Ready for entry</Alert>
            )}
          </Grid>
        )}

        {/* Entry Section */}
        {!activeEntry && selectedWorkerId !== '' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Entry Time"
                type="time"
                value={entryTime}
                onChange={(e) => setEntryTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={registering}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} display="flex" alignItems="flex-end">
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<EntryIcon />}
                onClick={handleRegisterEntry}
                disabled={loading || registering || selectedWorkerId === ''}
              >
                {registering ? <CircularProgress size={24} /> : 'Register Entry'}
              </Button>
            </Grid>
          </>
        )}

        {/* Exit Section */}
        {activeEntry && selectedWorkerId !== '' && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Exit Time"
                type="time"
                value={exitTime}
                onChange={(e) => setExitTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                disabled={registering}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Early exit reason..."
                size="small"
                disabled={registering}
                fullWidth
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<ExitIcon />}
                onClick={handleRegisterExit}
                disabled={loading || registering || !activeEntry}
              >
                {registering ? <CircularProgress size={24} /> : 'Register Exit'}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};
