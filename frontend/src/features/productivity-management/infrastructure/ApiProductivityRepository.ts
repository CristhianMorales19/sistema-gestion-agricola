import { ProductivityRecord } from '../domain/entities/Productivity';
import { ProductivityRepository } from '../domain/repositories/ProductivityRepository';
import { apiService } from '../../../services/api.service';

export class ApiProductivityRepository implements ProductivityRepository {
  private baseUrl = '/productividad';

  async getAllProductivity(): Promise<ProductivityRecord[]> {
    const response = await apiService.get<any>(this.baseUrl);


    if (!response.success) {
      throw new Error('Failed to fetch productivity records');
    }

    const records: ProductivityRecord[] = response.data.map((p: any) => ({
      id: String(p.id ?? ''),
      worker: {
        id: String(p.worker?.id ?? ''),
        name: p.worker?.name ?? '(Sin nombre)',
        identification: p.worker?.identification ?? '',
      },
      task: {
        id: String(p.task?.id ?? ''),
        name: p.task?.name ?? '(Sin tarea)',
        description: p.task?.description ?? '',
        unit: p.task?.unit ?? '',
        standardPerformance: Number(p.task?.standardPerformance ?? 0),
      },
      producedQuantity: Number(p.producedQuantity ?? 0),
      unit: p.unit ?? '',
      date: p.date ?? '',
      calculatedPerformance: Number(p.calculatedPerformance ?? 0),
      workingConditions: [],
    }));

    return records;
  }
}
