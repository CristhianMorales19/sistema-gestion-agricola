// src/employee-management/application/hooks/useEmployeeManagement.ts
import { useState, useCallback } from "react";
import {
  Employee,
  CreateEmployeeData,
  EditEmployeeData,
} from "../../domain/entities/employee";
import { LaborInfoData } from "@features/personnel-management/domain/entities/labor-info-employee";
import { EmployeeService } from "../services/employee.service";
import { useMessage } from "../../../../app/providers/MessageProvider";

const employeeService = new EmployeeService();

export const useEmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { showMessage } = useMessage();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    const result = await employeeService.getAllEmployees();
    setLoading(false);

    if (!result.success) {
      showMessage("error", result.error.message);
      return;
    }

    setEmployees(result.data);
  }, [showMessage]);

  const searchEmployees = useCallback(
    async (query: string) => {
      setLoading(true);
      const result = await employeeService.searchEmployees(query);
      setLoading(false);

      if (!result.success) {
        showMessage("error", result.error.message);
        return;
      }

      setEmployees(result.data);
    },
    [showMessage],
  );

  const createEmployee = useCallback(
    async (data: CreateEmployeeData) => {
      setLoading(true);
      const result = await employeeService.createEmployee(data);
      setLoading(false);

      if (result.success) {
        showMessage("success", result.data);
        await fetchEmployees();
        return true;
      }

      showMessage("error", result.error.message);
      return false;
    },
    [fetchEmployees, showMessage],
  );

  const updateEmployee = useCallback(
    async (id: number, data: EditEmployeeData) => {
      setLoading(true);
      const result = await employeeService.updateEmployee(id, data);
      setLoading(false);

      if (result.success) {
        showMessage("success", result.data);
        await fetchEmployees();
        return true;
      }

      showMessage("error", result.error.message);
      return false;
    },
    [fetchEmployees, showMessage],
  );

  const deleteEmployee = useCallback(
    async (id: number) => {
      setLoading(true);
      const result = await employeeService.deleteEmployee(id);
      setLoading(false);

      if (result.success) {
        showMessage("success", result.data);
        await fetchEmployees();
        return true;
      }

      showMessage("error", result.error.message);
      return false;
    },
    [fetchEmployees, showMessage],
  );

  const createLaborInfo = useCallback(
    async (id: number, laborInfo: LaborInfoData) => {
      setLoading(true);
      const result = await employeeService.createLaborInfo(id, laborInfo);
      setLoading(false);

      if (result.success) {
        showMessage("success", result.data);
        await fetchEmployees();
        return true;
      }

      showMessage("error", result.error.message);
      return false;
    },
    [fetchEmployees, showMessage],
  );

  const findById = useCallback(
    async (id: number) => {
      setLoading(true);
      const result = await employeeService.getEmployeeById(id);
      setLoading(false);

      if (!result.success) {
        showMessage("error", result.error.message);
        return;
      }

      return result.data;
    },
    [showMessage],
  );

  const getAllEmployeesWithoutCrew = useCallback(async () => {
    setLoading(true);
    const result = await employeeService.getAllEmployeesWithoutCrew();
    setLoading(false);

    if (!result.success) {
      showMessage("error", result.error.message);
      return;
    }

    setEmployees(result.data);
  }, [showMessage]);

  return {
    employees,
    loading,
    refreshEmployees: fetchEmployees,
    searchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    createLaborInfo,
    findById,
    getAllEmployeesWithoutCrew,
  };
};
