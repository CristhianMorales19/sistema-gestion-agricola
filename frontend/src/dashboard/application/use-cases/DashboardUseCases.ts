import { DashboardData } from '../../domain/entities/Dashboard';

export interface DashboardRepository {
  getDashboardData(): Promise<DashboardData>;
  refreshStats(): Promise<void>;
}

export class GetDashboardDataUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<DashboardData> {
    return await this.dashboardRepository.getDashboardData();
  }
}

export class RefreshDashboardStatsUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<void> {
    await this.dashboardRepository.refreshStats();
  }
}
