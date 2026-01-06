INSERT INTO mom_cuadrilla (
    codigo_identificador,
    nombre,
    descripcion,
    area_trabajo,
    fecha_creacion_at,
    is_activa,
    created_at,
    created_by
) VALUES
('CUAD-001', 'Cuadrilla Norte', 'Encargada de labores agrícolas en la zona norte', 'Zona Norte', NOW(), true, NOW(), 1),
('CUAD-002', 'Cuadrilla Sur', 'Equipo responsable de la recolección en la zona sur', 'Zona Sur', NOW(), false, NOW(), 1),
('CUAD-003', 'Cuadrilla Central', 'Cuadrilla de mantenimiento general en el área central', 'Zona Central', NOW(), true, NOW(), 1);

INSERT INTO mom_trabajador (
    documento_identidad,
    nombre_completo,
    fecha_nacimiento,
    telefono,
    email,
    is_activo,
    fecha_registro_at,
    created_at,
    updated_at,
    created_by,
    updated_by,
    deleted_at
)
VALUES
-- Trabajador 1
('305690123', 'Carlos Méndez López', '1985-04-15', '8888-1234', 'carlos.mendez@empresa.com', TRUE, NOW(), NOW(), NULL, 1, NULL, NULL),

-- Trabajador 2
('208450987', 'María Fernanda Rojas', '1990-09-02', '8777-5678', 'maria.rojas@empresa.com', TRUE, NOW(), NOW(), NULL, 1, NULL, NULL),

-- Trabajador 3
('115890654', 'José Antonio Vargas', '1982-12-21', '8654-4321', 'jose.vargas@empresa.com', TRUE, NOW(), NOW(), NULL, 1, NULL, NULL);
