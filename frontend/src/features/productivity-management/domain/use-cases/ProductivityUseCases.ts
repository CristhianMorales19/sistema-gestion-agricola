import { ProductivityRecord } from '../entities/Productivity';
import { ProductivityRepository } from '../repositories/ProductivityRepository';

export class ProductivityUseCases {
    constructor(private productivityRepository: ProductivityRepository) {}

    async getAllProductivity(): Promise<ProductivityRecord[]> {
        return this.productivityRepository.getAllProductivity();
    }
}