export interface ProductivityRecord {
    id: string;
    worker: {
        id: string;
        name: string;
        identification: string;
    };
    task: {
        id: string;
        name: string;
        description: string;
        unit: string;
        standardPerformance: number;
    };
    producedQuantity: number;
    unit: string;
    date: string;
    calculatedPerformance: number;
    workingConditions: Array<{
        id: string;
        date: string;
        generalCondition: string;
        difficultyLevel: string;
        observations: string;
    }>;
}

export interface ProductivityApiResponse {
    productividad_id: string;
    trabajador: {
        trabajador_id: string;
        nombre_completo: string;
        documento_identidad: string;
    };
    tarea: {
        tarea_id: string;
        nombre: string;
        descripcion: string;
        unidad_medicion: string;
        rendimiento_estandar: number;
    };
    cantidad_producida: number;
    unidad_medida: string;
    fecha_at: string;
    rendimiento_calculado: number;
    condiciones_trabajo: Array<{
        condicion_id: string;
        fecha_at: string;
        condicion_general: string;
        nivel_dificultad: string;
        observaciones: string;
    }>;
}