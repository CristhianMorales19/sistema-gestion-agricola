import { WorkConditionsService } from '../WorkConditionsService';
import { WorkCondition } from '../../domain/entities/WorkCondition';

describe('WorkConditionsService', () => {
  describe('validateWorkCondition', () => {
    it('should validate a valid work condition', () => {
      const validCondition: Partial<WorkCondition> = {
        fecha: '2025-12-24',
        condicionGeneral: 'despejado',
        nivelDificultad: 'normal',
        observacion: 'Día soleado',
      };

      const result = WorkConditionsService.validateWorkCondition(validCondition);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail without required fields', () => {
      const invalidCondition: Partial<WorkCondition> = {
        fecha: '2025-12-24',
      };

      const result = WorkConditionsService.validateWorkCondition(invalidCondition);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail with invalid condition general', () => {
      const invalidCondition: Partial<WorkCondition> = {
        fecha: '2025-12-24',
        condicionGeneral: 'invalid' as any,
        nivelDificultad: 'normal',
      };

      const result = WorkConditionsService.validateWorkCondition(invalidCondition);

      expect(result.isValid).toBe(false);
    });

    it('should fail with observation exceeding 200 characters', () => {
      const invalidCondition: Partial<WorkCondition> = {
        fecha: '2025-12-24',
        condicionGeneral: 'despejado',
        nivelDificultad: 'normal',
        observacion: 'a'.repeat(201),
      };

      const result = WorkConditionsService.validateWorkCondition(invalidCondition);

      expect(result.isValid).toBe(false);
    });
  });

  describe('getConditionColor', () => {
    it('should return correct color for each condition', () => {
      expect(WorkConditionsService.getConditionColor('despejado')).toBe('#fbbf24');
      expect(WorkConditionsService.getConditionColor('lluvioso')).toBe('#3b82f6');
      expect(WorkConditionsService.getConditionColor('muy_caluroso')).toBe('#ef4444');
      expect(WorkConditionsService.getConditionColor('nublado')).toBe('#6b7280');
    });

    it('should return default color for unknown condition', () => {
      expect(WorkConditionsService.getConditionColor('unknown')).toBe('#6b7280');
    });
  });

  describe('getDifficultyColor', () => {
    it('should return correct color for each difficulty level', () => {
      expect(WorkConditionsService.getDifficultyColor('normal')).toBe('#10b981');
      expect(WorkConditionsService.getDifficultyColor('dificil')).toBe('#f97316');
      expect(WorkConditionsService.getDifficultyColor('muy_dificil')).toBe('#ef4444');
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats for empty conditions', () => {
      const stats = WorkConditionsService.calculateStats([]);

      expect(stats.totalRegistros).toBe(0);
      expect(stats.dificultadPromedio).toBe('N/A');
    });

    it('should calculate stats for multiple conditions', () => {
      const conditions: WorkCondition[] = [
        {
          fecha: '2025-12-24',
          condicionGeneral: 'despejado',
          nivelDificultad: 'normal',
        },
        {
          fecha: '2025-12-25',
          condicionGeneral: 'lluvioso',
          nivelDificultad: 'dificil',
        },
      ];

      const stats = WorkConditionsService.calculateStats(conditions);

      expect(stats.totalRegistros).toBe(2);
      expect(stats.condicionesPorTipo.despejado).toBe(1);
      expect(stats.condicionesPorTipo.lluvioso).toBe(1);
    });
  });
});
