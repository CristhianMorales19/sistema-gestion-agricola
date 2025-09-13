-- =====================================================
-- SCRIPT DE REPARACIÓN PARA ERROR DE SINTAXIS
-- =====================================================

-- En MySQL, CREATE INDEX IF NOT EXISTS no es válida
-- Usamos este patrón en su lugar:

-- Para crear índices de forma segura:
DROP PROCEDURE IF EXISTS CreateIndexIfNotExists;

DELIMITER $$
CREATE PROCEDURE CreateIndexIfNotExists(
    IN table_name VARCHAR(128),
    IN index_name VARCHAR(128), 
    IN index_definition TEXT
)
BEGIN
    DECLARE index_exists INT DEFAULT 0;
    
    SELECT COUNT(*) INTO index_exists
    FROM information_schema.STATISTICS 
    WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = table_name
        AND INDEX_NAME = index_name;
        
    IF index_exists = 0 THEN
        SET @sql = CONCAT('CREATE INDEX ', index_name, ' ON ', table_name, ' ', index_definition);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$
DELIMITER ;

-- Ahora podemos crear índices de forma segura:
-- CALL CreateIndexIfNotExists('mom_trabajador', 'idx_mom_trabajador_documento', '(documento_identidad)');

-- =====================================================
-- ALTERNATIVA MÁS SIMPLE: Ignorar errores de índices duplicados
-- =====================================================

-- Si prefieres la solución simple, puedes usar:
-- CREATE INDEX idx_nombre ON tabla(campo); 
-- Y si ya existe, simplemente ignorar el error

SELECT 'Script de reparación creado. Úsalo según necesites.' as mensaje;
