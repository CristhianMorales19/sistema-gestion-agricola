export interface DashboardStatistic {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  bgColor: string;
  category: 'farms' | 'users' | 'crops' | 'alerts' | 'auth' | 'roles' | 'permissions';
}

export interface DashboardActivity {
  id: string;
  type: 'farm' | 'user' | 'system' | 'alert';
  text: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

export interface DashboardCondition {
  id: string;
  label: string;
  value: string;
  icon?: string;
  unit?: string;
  type?: 'temperature' | 'humidity' | 'rain' | 'wind';
}

export interface DashboardData {
  stats: DashboardStatistic[];
  activities: DashboardActivity[];
  conditions: DashboardCondition[];
  lastUpdated: Date;
}
