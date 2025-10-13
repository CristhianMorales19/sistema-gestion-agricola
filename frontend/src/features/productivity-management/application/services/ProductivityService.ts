import { ProductivityUseCases } from '../../domain/use-cases/ProductivityUseCases';
import { ApiProductivityRepository } from '../../infrastructure/ApiProductivityRepository';
import { ProductivityRecord  } from '../../domain/entities/Productivity';

export class ProductivityService {
    private productivityUseCases: ProductivityUseCases;

    constructor() {
        const repository = new ApiProductivityRepository();
        this.productivityUseCases = new ProductivityUseCases(repository);
    }

    async getAllProductivity(): Promise<ProductivityRecord[]> {
        return this.productivityUseCases.getAllProductivity();
    }
}