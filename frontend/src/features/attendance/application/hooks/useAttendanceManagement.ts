import { useState, useCallback, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AttendanceRecord, RegisterEntryData, RegisterExitData, Worker } from '../../domain/entities/Attendance';
import { AttendanceService } from '../services/AttendanceService';
import { useMessage } from '../../../../app/providers/MessageProvider';

export const useAttendanceManagement = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  // Wrap service initialization in useMemo to prevent recreation on every render
  const attendanceService = useMemo(() => {
    return new AttendanceService(async () => {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
      }
    });
  }, [getAccessTokenSilently]);

  const fetchActiveWorkers = useCallback(async () => {
    setLoading(true);
    const result = await attendanceService.getActiveWorkers();
    setLoading(false);

    if (!result.success) {
      showMessage('error', result.error.message);
      return;
    }

    setWorkers(result.data);
  }, [attendanceService, showMessage]);

  const registerEntry = useCallback(async (data: RegisterEntryData) => {
    setLoading(true);
    const result = await attendanceService.registerEntry(data);
    setLoading(false);

    if (result.success) {
      showMessage('success', 'Entry registered successfully');
      return true;
    }

    showMessage('error', result.error.message);
    return false;
  }, [attendanceService, showMessage]);

  const registerExit = useCallback(async (attendanceId: number, data: RegisterExitData) => {
    setLoading(true);
    const result = await attendanceService.registerExit(attendanceId, data);
    setLoading(false);

    if (result.success) {
      showMessage('success', 'Exit registered successfully');
      return true;
    }

    showMessage('error', result.error.message);
    return false;
  }, [attendanceService, showMessage]);

  const getWorkerActiveEntry = useCallback(async (workerId: number) => {
    const result = await attendanceService.getWorkerActiveEntry(workerId);
    if (!result.success) {
      return null;
    }
    return result.data;
  }, [attendanceService]);

  const getWorkerAttendances = useCallback(async (workerId: number) => {
    setLoading(true);
    const result = await attendanceService.getWorkerAttendances(workerId);
    setLoading(false);

    if (!result.success) {
      showMessage('error', result.error.message);
      return;
    }

    setAttendances(result.data);
  }, [attendanceService, showMessage]);

  const fetchAllAttendances = useCallback(async (page: number = 1, limit: number = 1000) => {
    setLoading(true);
    const result = await attendanceService.getAllAttendances(page, limit);
    setLoading(false);

    if (!result.success) {
      showMessage('error', result.error.message);
      return { data: [], total: 0 };
    }

    setAttendances(result.data.data);
    return result.data;
  }, [attendanceService, showMessage]);

  const getWorkerStatistics = useCallback(async (workerId: number, startDate?: string, endDate?: string) => {
    const result = await attendanceService.getWorkerStatistics(workerId, startDate, endDate);
    if (!result.success) {
      showMessage('error', result.error.message);
      return null;
    }
    return result.data;
  }, [attendanceService, showMessage]);

  const deleteAttendance = useCallback(async (id: number) => {
    setLoading(true);
    const result = await attendanceService.deleteAttendance(id);
    setLoading(false);

    if (result.success) {
      showMessage('success', 'Attendance deleted successfully');
      await fetchAllAttendances();
      return true;
    }

    showMessage('error', result.error.message);
    return false;
  }, [attendanceService, fetchAllAttendances, showMessage]);

  const updateAttendance = useCallback(async (id: number, data: Partial<AttendanceRecord>) => {
    setLoading(true);
    const result = await attendanceService.updateAttendance(id, data);
    setLoading(false);

    if (result.success) {
      showMessage('success', 'Attendance updated successfully');
      return true;
    }

    console.error(`❌ useAttendanceManagement.updateAttendance: Error:`, result.error.message);
    showMessage('error', result.error.message);
    return false;
  }, [attendanceService, showMessage]);

  return {
    workers,
    attendances,
    loading,
    fetchActiveWorkers,
    registerEntry,
    registerExit,
    getWorkerActiveEntry,
    getWorkerAttendances,
    fetchAllAttendances,
    getWorkerStatistics,
    deleteAttendance,
    updateAttendance,
  };
};
