import { ProductivityRecord, ProductivityApiResponse } from '../entities/Productivity';

export interface ProductivityRepository {
     getAllProductivity(): Promise<ProductivityRecord[]>;
}