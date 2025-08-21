import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../../app';

// Esquema de validación para login
const loginSchema = z.object({
  email: z.string().email('Email debe tener un formato válido'),
  password: z.string().min(1, 'Contraseña es requerida')
});

// Controlador para login
export const login = async (req: Request, res: Response) => {
  try {
    // Validar datos de entrada
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: validationResult.error.errors
      });
    }

    const { email, password } = validationResult.data;

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true
      }
    });

    // Verificar si usuario existe
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar si usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: 'Su cuenta ha sido desactivada. Contacte al administrador'
      });
    }

    // Verificar contraseña
    const passwordMatches = await bcrypt.compare(password, usuario.password);
    
    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        exp: Math.floor(Date.now() / 1000) + (8 * 60 * 60) // 8 horas
      },
      jwtSecret
    );

    // Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    });

    // Respuesta exitosa
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        token,
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol
        }
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Controlador para logout
export const logout = async (req: Request, res: Response) => {
  try {
    // En una implementación real, aquí se podría invalidar el token
    // Por ahora, simplemente retornamos éxito
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};