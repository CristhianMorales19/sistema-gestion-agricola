import { CreateCrew, Crew, UpdateCrew } from "./crew";

export interface CrewRepository {
  findAll(): Promise<Crew[]>;
  workersExist(ids: number[]): Promise<number[]>;
  existsByCode(code: string): Promise<boolean>;
  create(data: CreateCrew, userId: number): Promise<void>;
  update(data: UpdateCrew, userId: number, crewId: number): Promise<void>;
  existsById(crewId: number): Promise<boolean>;
  delete(userId: number, crewId: number): Promise<void>;
  search(query: string): Promise<Crew[]>;
}
