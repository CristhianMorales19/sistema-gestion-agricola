// src/employee-management/application/hooks/useEmployeeManagement.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { EmployeeService } from '../services/EmployeeService';
import { Employee, CreateEmployeeData, LaborInfoData } from '../../domain/entities/Employee';

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const employeeService = useMemo(() => new EmployeeService(), []);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Endpoint no encontrado. Verifica la configuración del servidor.');
      } else if (err.response?.status === 401) {
        setError('No autorizado. Por favor, inicia sesión.');
      } else {
        setError('Error al cargar los empleados');
      }
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  }, [employeeService]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);


  const createEmployee = async (data: CreateEmployeeData): Promise<Employee> => {
    try {
        const newEmployee = await employeeService.createEmployee(data);
        await loadEmployees();
        setError(null);
        setSuccessMessage('Empleado creado exitosamente');
        return newEmployee;
    } catch (err: any) {
        const errorMessage = err.message || 'Error al crear el empleado';
        setError(errorMessage);
        setSuccessMessage(null);
        console.error('Error creating employee:', err);
        throw err;
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>): Promise<boolean> => {
    try {
      const result = await employeeService.updateEmployee(id, data);
      if (result.success) {
        setSuccessMessage(result.message);
        console.log('Mensaje del backend:', result.message);
        setError(null);
        await loadEmployees();
        return true;
      } else {
        setError(result.message);
        setSuccessMessage(null);
        return false;
      }
    } catch (err) {
      setError('Error al actualizar el empleado');
      console.error(err);
      return false;
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      setSuccessMessage("Empleado eliminado correctamente");
    } catch (err: any) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Error al eliminar el empleadooo');
      console.error('Error al eliminar empleado:', err);
    }
  };


  const searchEmployees = async (query: string): Promise<Employee[]> => {
    setLoading(true);
    setError(null);
    try {
      const results = await employeeService.searchEmployees(query);
      setEmployees(results);
      return results;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al buscar empleados';
      setError(errorMsg);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLaborInfo = async (laborInfo: LaborInfoData): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await employeeService.createLaborInfo(laborInfo);
      
      if (result.success) {
        setSuccessMessage(result.message);
        console.log('Mensaje del backend:', result.message);
        setError(null);
        await loadEmployees();
        return true;
      } else {
        setError(result.message);
        setSuccessMessage(null);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Error al crear la información laboral';
      setError(errorMessage);
      setSuccessMessage(null);
      console.error('Error creating labor info:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    employees,
    loading,
    error,
    successMessage,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    refreshEmployees: loadEmployees,
    createLaborInfo,
    clearMessages
  };
};

export default useEmployeeManagement;