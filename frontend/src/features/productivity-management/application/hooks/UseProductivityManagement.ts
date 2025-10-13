import { useState, useCallback } from 'react';
import { ProductivityRecord } from '../../domain/entities/Productivity';
import { ApiProductivityRepository } from '../../infrastructure/ApiProductivityRepository';
import { ProductivityUseCases } from '../../domain/use-cases/ProductivityUseCases';

const productivityRepository = new ApiProductivityRepository();
const productivityUseCases = new ProductivityUseCases(productivityRepository);

export const UseProductivityManagement = () => {
    const [productivityRecords, setProductivityRecords] = useState<ProductivityRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProductivity = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const records = await productivityUseCases.getAllProductivity();
            setProductivityRecords(records);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch productivity records');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        productivityRecords,
        loading,
        error,
        fetchProductivity
    };
};
