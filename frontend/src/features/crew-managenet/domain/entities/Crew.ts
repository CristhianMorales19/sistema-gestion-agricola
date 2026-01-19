import { Employee } from "@features/personnel-management";

export interface CreateCrewData {
  id: number;
  description: string;
  workArea: string;
  active: boolean;
  code: string;
  workers: Employee[];
  [key: string]: unknown;
}

export interface Crew {
  id: number;
  description: string;
  workArea: string;
  active: boolean;
  code: string;
  workers: Employee[];
}
