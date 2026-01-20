// src/employee-management/application/hooks/useEmployeeManagement.ts
import { useState, useCallback } from 'react';
import { Employee, CreateEmployeeData, UpdateEmployeeData, LaborInfoData } from '../../domain/entities/Employee';
import { EmployeeService } from '../services/EmployeeService';
import { useMessage } from '../../../../app/providers/MessageProvider';

const employeeService = new EmployeeService();

export const useEmployeeManagement = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const { showMessage } = useMessage();

    const fetchEmployees = useCallback(async (): Promise<Employee[] | null> => {
        setLoading(true);
        const result = await employeeService.getAllEmployees();
        setLoading(false);

        if (!result.success) {
            showMessage('error', result.error.message);
            return null;
        }

        setAllEmployees(result.data);
        setEmployees(result.data);
        return result.data;
    }, [showMessage]);

    const searchEmployees = useCallback(async (query: string) => {
        const q = (query ?? '').trim().toLowerCase();

        // Si no hay búsqueda, restaurar lista completa.
        if (!q) {
            setEmployees(allEmployees);
            return;
        }

        // Asegurar que tenemos lista base cargada.
        let base = allEmployees;
        if (base.length === 0) {
            const fetched = await fetchEmployees();
            base = fetched ?? [];
        }

        const filtered = base.filter((e) => {
            const name = (e.name ?? '').toLowerCase();
            const identification = String(e.identification ?? '').toLowerCase();
            const cargo = String(e.cargo ?? '').toLowerCase();
            const position = String(e.position ?? '').toLowerCase();

            return (
                name.includes(q) ||
                identification.includes(q) ||
                cargo.includes(q) ||
                position.includes(q)
            );
        });

        setEmployees(filtered);
    }, [allEmployees, fetchEmployees]);

    const createEmployee = useCallback(async (data: CreateEmployeeData) => {
        setLoading(true);
        const result = await employeeService.createEmployee(data);
        setLoading(false);

        if (result.success) {
            showMessage('success', result.data);
            await fetchEmployees();
            return true;
        }

        showMessage('error', result.error.message);
        return false;
    }, [fetchEmployees, showMessage]);

    const updateEmployee = useCallback(async (id: string, data: UpdateEmployeeData) => {
        setLoading(true);
        const result = await employeeService.updateEmployee(id, data);
        setLoading(false);

        if (result.success) {
            showMessage('success', result.data);
            await fetchEmployees();
            return true;
        }

        showMessage('error', result.error.message);
        return false;
    }, [fetchEmployees, showMessage]);

    const updateEmployeeLaborInfo = useCallback(async (id: string, laborData: UpdateEmployeeData) => {
        setLoading(true);
        const result = await employeeService.updateEmployee(id, laborData);
        setLoading(false);

        if (result.success) {
            showMessage('success', result.data);
            await fetchEmployees();
            return true;
        }

        showMessage('error', result.error.message);
        return false;
    }, [fetchEmployees, showMessage]);

    const deleteEmployee = useCallback(async (id: string) => {
        setLoading(true);
        const result = await employeeService.deleteEmployee(id);
        setLoading(false);

        if (result.success) {
            showMessage('success', result.data);
            await fetchEmployees();
            return true;
        }

        showMessage('error', result.error.message);
        return false;
    }, [fetchEmployees, showMessage]);

    const createLaborInfo = useCallback(async (laborInfo: LaborInfoData) => {
        setLoading(true);
        const result = await employeeService.createLaborInfo(laborInfo);
        setLoading(false);

        if (result.success) {
            showMessage('success', result.data);
            await fetchEmployees();
            return true;
        }

        showMessage('error', result.error.message);
        return false;
    }, [fetchEmployees, showMessage]);

    return {
        employees,
        loading,
        refreshEmployees: fetchEmployees,
        searchEmployees,
        createEmployee,
        updateEmployee,
        updateEmployeeLaborInfo,
        deleteEmployee,
        createLaborInfo,
    };
};
