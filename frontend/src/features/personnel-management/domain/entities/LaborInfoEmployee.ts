export interface LaborInfoData {
  position: string;
  baseSalary: number | "";
  contractType: string;
  area: string;
  payrollCode: string;
  salaryGross: number | "";
  ccssDeduction: number | "";
  otherDeductions: number | "";
  salaryPerHour: number | "";
  ordinaryHours: number | "";
  extraHours: number | "";
  otherHours: number | "";
  vacationAmount: number | "";
  incapacityAmount: number | "";
  lactationAmount: number | "";
  [key: string]: unknown;
}
