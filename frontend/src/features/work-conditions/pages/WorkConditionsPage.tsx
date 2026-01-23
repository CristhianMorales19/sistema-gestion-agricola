import React from 'react';
import { WorkConditionsView } from '../presentation';
import { useWorkConditions } from '../application/hooks';
import { CreateWorkConditionDTO } from '../domain/entities/WorkCondition';

export const WorkConditionsPage: React.FC = () => {
  const { 
    conditions, 
    error, 
    loading,
    addCondition, 
    clearError 
  } = useWorkConditions([]);

  const handleSubmit = async (data: CreateWorkConditionDTO): Promise<boolean> => {
    try {
      const success = await addCondition(data);
      if (!success) {
        console.error('❌ Error al registrar condición:', error);
      }
      return success;
    } catch (err) {
      console.error('❌ Error en handleSubmit:', err);
      return false;
    }
  };

  return (
    <WorkConditionsView 
      onSubmit={handleSubmit} 
      conditions={conditions}
      loading={loading}
      error={error}
      onErrorClose={clearError}
    />
  );
};
