import { Router } from 'express';
import { checkJwt } from '../shared/infrastructure/config/auth0.config';
import { AusenciasController } from '../controllers/ausencias.controller';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/ausencias');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `ausencia-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos PDF, JPG y PNG'));
  }
});

/**
 * @route GET /api/ausencias/estadisticas
 * @desc Obtener estadísticas de ausencias
 * @access Requiere autenticación Auth0
 */
router.get('/estadisticas', 
  checkJwt,
  AusenciasController.getEstadisticas
);

/**
 * @route GET /api/ausencias
 * @desc Obtener lista de ausencias con filtros
 * @access Requiere autenticación Auth0
 */
router.get('/', 
  checkJwt,
  AusenciasController.getAll
);

/**
 * @route GET /api/ausencias/:id
 * @desc Obtener ausencia por ID
 * @access Requiere autenticación Auth0
 */
router.get('/:id',
  checkJwt,
  AusenciasController.getById
);

/**
 * @route POST /api/ausencias
 * @desc Crear nueva ausencia
 * @access Requiere autenticación Auth0
 */
router.post('/', 
  checkJwt,
  AusenciasController.create
);

/**
 * @route PUT /api/ausencias/:id
 * @desc Actualizar ausencia
 * @access Requiere autenticación Auth0
 */
router.put('/:id', 
  checkJwt,
  AusenciasController.update
);

/**
 * @route DELETE /api/ausencias/:id
 * @desc Eliminar ausencia
 * @access Requiere autenticación Auth0
 */
router.delete('/:id', 
  checkJwt,
  AusenciasController.delete
);

/**
 * @route POST /api/ausencias/:id/aprobar
 * @desc Aprobar ausencia
 * @access Requiere autenticación Auth0
 */
router.post('/:id/aprobar', 
  checkJwt,
  AusenciasController.aprobar
);

/**
 * @route POST /api/ausencias/:id/rechazar
 * @desc Rechazar ausencia
 * @access Requiere autenticación Auth0
 */
router.post('/:id/rechazar', 
  checkJwt,
  AusenciasController.rechazar
);

/**
 * @route POST /api/ausencias/:id/documento
 * @desc Subir documento de respaldo
 * @access Requiere autenticación Auth0
 */
router.post('/:id/documento',
  checkJwt,
  upload.single('documento'),
  AusenciasController.subirDocumento
);

export default router;