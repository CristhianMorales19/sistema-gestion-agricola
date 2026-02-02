import { Employee } from "../../employee-management/domain/employee";

export interface Crew {
  id: number;
  description?: string;
  workArea?: string;
  active: boolean;
  code: string;
  workers: Employee[];
}

export interface CreateCrew {
  description?: string;
  workArea?: string;
  code: string;
  workers?: number[];
}

export interface UpdateCrew {
  description?: string;
  workArea?: string;
  code?: string;
  workers?: number[];
}
