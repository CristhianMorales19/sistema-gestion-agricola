import { CreateEmployeeData } from "@features/personnel-management/domain/entities/employee";

export const INITIAL_CREATE_EMPLOYEE: CreateEmployeeData = {
  identification: "",
  name: "",
  birthDate: "",
  hireDate: new Date().toISOString().split("T")[0],
  phone: "",
  email: "",
};
