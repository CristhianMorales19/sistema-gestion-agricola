// src/employee-management/application/hooks/useEmployeeManagement.ts
import { useState, useEffect } from 'react';
import { EmployeeService } from '../services/EmployeeService';
import { Employee, CreateEmployeeData, UpdateEmployeeData } from '../../domain/entities/Employee';

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const employeeService = new EmployeeService();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
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
  };

  const createEmployee = async (data: CreateEmployeeData): Promise<Employee> => {
    try {
        const newEmployee = await employeeService.createEmployee(data);
        setEmployees(prev => [...prev, newEmployee]);
        setError(null);
        return newEmployee;
    } catch (err: any) {
        const errorMessage = err.message || 'Error al crear el empleado';
        setError(errorMessage);
        console.error('Error creating employee:', err);
        throw err;
    }
  };

  const updateEmployee = async (id: string, data: UpdateEmployeeData): Promise<Employee> => {
    try {
      const updatedEmployee = await employeeService.updateEmployee(id, data);
      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
      return updatedEmployee;
    } catch (err) {
      setError('Error al actualizar el empleado');
      console.error(err);
      throw err;
    }
  };

  const updateEmployeeLaborInfo = async (id: string, laborData: any): Promise<Employee> => {
    // Reutiliza updateEmployee pero permite payloads laborales extendidos
    try {
      const payload: any = {
        cargo: laborData.position,
        salario_base: laborData.baseSalary,
        tipo_contrato: laborData.contractType,
        codigo_nomina: laborData.payrollCode,
        salario_bruto: laborData.salaryGross,
        rebajas_ccss: laborData.ccssDeduction,
        otras_rebajas: laborData.otherDeductions,
        salario_por_hora: laborData.salaryPerHour,
        horas_ordinarias: laborData.ordinaryHours,
        horas_extras: laborData.extraHours,
        horas_otras: laborData.otherHours,
        vacaciones_monto: laborData.vacationAmount,
        incapacidad_monto: laborData.incapacityAmount,
        lactancia_monto: laborData.lactationAmount,
      };

      const updated = await updateEmployee(id, payload);
      return updated;
    } catch (err) {
      console.error('Error updating labor info:', err);
      throw err;
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    try {
      await employeeService.deleteEmployee(id);
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } catch (err) {
      setError('Error al eliminar el empleado');
      console.error(err);
      throw err;
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

  return {
    employees,
    loading,
    error,
    createEmployee,
    updateEmployee,
    updateEmployeeLaborInfo,
    deleteEmployee,
    searchEmployees,
    refreshEmployees: loadEmployees
  };
};

export default useEmployeeManagement;