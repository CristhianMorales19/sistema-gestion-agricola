import { WorkCondition } from "../domain/entities/WorkCondition";

export class WorkConditionsService {
  /**
   * Valida que una condición de trabajo sea válida
   */
  static validateWorkCondition(data: Partial<WorkCondition>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.fecha) {
      errors.push("La fecha es obligatoria");
    }

    if (!data.condicionGeneral) {
      errors.push("La condición general es obligatoria");
    } else if (
      !["despejado", "lluvioso", "muy_caluroso", "nublado"].includes(
        data.condicionGeneral,
      )
    ) {
      errors.push("Condición general inválida");
    }

    if (!data.nivelDificultad) {
      errors.push("El nivel de dificultad es obligatorio");
    } else if (
      !["normal", "dificil", "muy_dificil"].includes(data.nivelDificultad)
    ) {
      errors.push("Nivel de dificultad inválido");
    }

    if (data.observaciones && data.observaciones.length > 200) {
      errors.push("La observación no puede exceder 200 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Formatea una fecha para mostrar en la UI
   */
  static formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  /**
   * Obtiene el color de una condición
   */
  static getConditionColor(condition: string): string {
    const colors: Record<string, string> = {
      despejado: "#fbbf24",
      lluvioso: "#3b82f6",
      muy_caluroso: "#ef4444",
      nublado: "#6b7280",
    };
    return colors[condition] || "#6b7280";
  }

  /**
   * Obtiene el icono de una condición
   */
  static getConditionIcon(condition: string): string {
    const icons: Record<string, string> = {
      despejado: "☀️",
      lluvioso: "🌧️",
      muy_caluroso: "🔥",
      nublado: "☁️",
    };
    return icons[condition] || "☁️";
  }

  /**
   * Obtiene el color de un nivel de dificultad
   */
  static getDifficultyColor(difficulty: string): string {
    const colors: Record<string, string> = {
      normal: "#10b981",
      dificil: "#f97316",
      muy_dificil: "#ef4444",
    };
    return colors[difficulty] || "#10b981";
  }

  /**
   * Obtiene la etiqueta de un nivel de dificultad
   */
  static getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      normal: "Normal",
      dificil: "Difícil",
      muy_dificil: "Muy Difícil",
    };
    return labels[difficulty] || difficulty;
  }

  /**
   * Agrupa condiciones por mes
   */
  static groupConditionsByMonth(
    conditions: WorkCondition[],
    month: number,
    year: number,
  ): Map<string, WorkCondition> {
    const map = new Map<string, WorkCondition>();

    conditions.forEach((condition) => {
      const date = new Date(condition.fecha);
      if (date.getMonth() === month && date.getFullYear() === year) {
        map.set(condition.fecha, condition);
      }
    });

    return map;
  }

  /**
   * Calcula estadísticas de condiciones
   */
  static calculateStats(conditions: WorkCondition[]): {
    totalRegistros: number;
    condicionesPorTipo: Record<string, number>;
    dificultadPromedio: string;
  } {
    if (conditions.length === 0) {
      return {
        totalRegistros: 0,
        condicionesPorTipo: {},
        dificultadPromedio: "N/A",
      };
    }

    const condicionesPorTipo: Record<string, number> = {
      despejado: 0,
      lluvioso: 0,
      muy_caluroso: 0,
      nublado: 0,
    };

    const dificultadCount: Record<string, number> = {
      normal: 0,
      dificil: 0,
      muy_dificil: 0,
    };

    conditions.forEach((c) => {
      condicionesPorTipo[c.condicionGeneral]++;
      dificultadCount[c.nivelDificultad]++;
    });

    const totalDificil =
      dificultadCount.dificil * 1 + dificultadCount.muy_dificil * 2;
    const promedio = totalDificil / conditions.length;

    let dificultadPromedio = "Normal";
    if (promedio > 1.5) {
      dificultadPromedio = "Muy Difícil";
    } else if (promedio > 0.5) {
      dificultadPromedio = "Difícil";
    }

    return {
      totalRegistros: conditions.length,
      condicionesPorTipo,
      dificultadPromedio,
    };
  }
}
