import { DashboardRepository } from '../application/use-cases/DashboardUseCases';
import { DashboardData, DashboardStatistic, DashboardActivity, DashboardCondition } from '../domain/entities/Dashboard';
import { DashboardApiClient, DashboardApiResponse } from './DashboardApiClient';

export class ApiDashboardRepository implements DashboardRepository {
  private apiClient: DashboardApiClient;

  constructor(getAccessToken: () => Promise<string>) {
    this.apiClient = new DashboardApiClient(getAccessToken);
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      const response: DashboardApiResponse = await this.apiClient.getDashboardData();
      
      // Transformar datos REALES de la BD al formato de la entidad del dominio
      const stats: DashboardStatistic[] = [
        {
          id: 'stat-1',
          title: 'Trabajadores Registrados',
          value: response.data.estadisticas.trabajadores.valor.toString(),
          change: response.data.estadisticas.trabajadores.cambio,
          changeType: response.data.estadisticas.trabajadores.tendencia === 'real' ? 'positive' : 'negative',
          bgColor: '#10b981',
          category: 'users'
        },
        {
          id: 'stat-2',
          title: 'Usuarios Activos',
          value: response.data.estadisticas.usuarios.valor.toString(),
          change: response.data.estadisticas.usuarios.cambio,
          changeType: response.data.estadisticas.usuarios.tendencia === 'real' ? 'positive' : 'negative',
          bgColor: '#3b82f6',
          category: 'auth'
        },
        {
          id: 'stat-3',
          title: 'Roles Configurados',
          value: response.data.estadisticas.roles.valor.toString(),
          change: response.data.estadisticas.roles.cambio,
          changeType: response.data.estadisticas.roles.tendencia === 'real' ? 'positive' : 'negative',
          bgColor: '#06b6d4',
          category: 'roles'
        },
        {
          id: 'stat-4',
          title: 'Permisos Activos',
          value: response.data.estadisticas.permisos.valor.toString(),
          change: response.data.estadisticas.permisos.cambio,
          changeType: response.data.estadisticas.permisos.tendencia === 'real' ? 'positive' : 'negative',
          bgColor: '#8b5cf6',
          category: 'permissions'
        },
        {
          id: 'stat-5',
          title: 'Alertas Pendientes',
          value: response.data.estadisticas.alertas.valor.toString(),
          change: response.data.estadisticas.alertas.cambio,
          changeType: response.data.estadisticas.alertas.tendencia === 'positiva' ? 'positive' : 'negative',
          bgColor: '#ef4444',
          category: 'alerts'
        }
      ];

      const activities: DashboardActivity[] = response.data.actividadReciente.map((activity, index) => ({
        id: activity.id,
        type: this.mapActivityType(activity.tipo),
        text: activity.mensaje,
        time: this.formatTimestamp(activity.timestamp),
        status: this.mapPriorityToStatus(activity.prioridad)
      }));

      const conditions: DashboardCondition[] = [
        {
          id: 'temp',
          label: 'Temperatura',
          value: response.data.condicionesClimaticas.temperatura,
          icon: '🌡️'
        },
        {
          id: 'humidity',
          label: 'Humedad',
          value: response.data.condicionesClimaticas.humedad,
          icon: '💧'
        },
        {
          id: 'rain',
          label: 'Lluvia (24h)',
          value: response.data.condicionesClimaticas.lluvia,
          icon: '☔'
        },
        {
          id: 'wind',
          label: 'Viento',
          value: response.data.condicionesClimaticas.viento,
          icon: '💨'
        }
      ];

      return {
        stats,
        activities,
        conditions,
        lastUpdated: new Date(response.data.timestamp)
      };

    } catch (error) {
      console.error('Error obteniendo datos del dashboard:', error);
      
      // Fallback a datos básicos en caso de error
      return this.getFallbackData();
    }
  }

  async refreshStats(): Promise<void> {
    try {
      // Refrescar estadísticas en tiempo real
      await this.apiClient.getRealTimeStats();
    } catch (error) {
      console.error('Error refrescando estadísticas:', error);
      throw error;
    }
  }

  private mapActivityType(apiType: string): 'farm' | 'user' | 'system' | 'alert' {
    const typeMap: Record<string, 'farm' | 'user' | 'system' | 'alert'> = {
      'produccion': 'farm',
      'personal': 'user', 
      'sistema': 'system',
      'alerta': 'alert',
      'tarea': 'farm'
    };
    return typeMap[apiType] || 'system';
  }

  private mapPriorityToStatus(priority: string): 'success' | 'info' | 'warning' | 'error' {
    const statusMap: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
      'baja': 'info',
      'media': 'info',
      'alta': 'success',
      'critica': 'error'
    };
    return statusMap[priority] || 'info';
  }

  private formatTimestamp(timestamp: string): string {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) { // Menos de 24 horas
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} horas`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} días`;
    }
  }

  private getFallbackData(): DashboardData {
    return {
      stats: [
        {
          id: 'stat-error',
          title: 'Error de Conexión',
          value: 'N/A',
          change: 'Sin conexión al servidor',
          changeType: 'negative',
          bgColor: '#ef4444',
          category: 'alerts'
        }
      ],
      activities: [
        {
          id: 'error-activity',
          type: 'system',
          text: 'Error conectando con el servidor. Verificar conexión.',
          time: 'Ahora',
          status: 'error'
        }
      ],
      conditions: [
        {
          id: 'error-condition',
          label: 'Estado',
          value: 'Sin conexión',
          icon: '❌'
        }
      ],
      lastUpdated: new Date()
    };
  }
}
