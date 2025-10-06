import { DashboardData } from '../../domain/entities/Dashboard';
import { GetDashboardDataUseCase, RefreshDashboardStatsUseCase } from '../use-cases/DashboardUseCases';

export class DashboardService {
  constructor(
    private getDashboardDataUseCase: GetDashboardDataUseCase,
    private refreshDashboardStatsUseCase: RefreshDashboardStatsUseCase
  ) {}

  async getDashboardData(): Promise<DashboardData> {
    return await this.getDashboardDataUseCase.execute();
  }

  async refreshStats(): Promise<void> {
    await this.refreshDashboardStatsUseCase.execute();
  }
}
