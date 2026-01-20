export type CondicionGeneral = 'despejado' | 'lluvioso' | 'muy_caluroso' | 'nublado';
export type NivelDificultad = 'normal' | 'dificil' | 'muy_dificil';

export interface WorkCondition {
  id?: number;
  fecha: string;
  condicionGeneral: CondicionGeneral;
  nivelDificultad: NivelDificultad;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateWorkConditionDTO {
  fecha: string;
  condicionGeneral: CondicionGeneral;
  nivelDificultad: NivelDificultad;
  observaciones?: string;
}

export interface UpdateWorkConditionDTO {
  condicionGeneral?: CondicionGeneral;
  nivelDificultad?: NivelDificultad;
  observaciones?: string;
}

export interface WorkConditionResponse {
  success: boolean;
  data?: WorkCondition;
  message?: string;
}
