import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipos para resultados de consultas SQL
type RawSQLResult = Record<string, unknown>;

type PermisoRaw = {
  permiso_id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
};

type Auth0UserData = {
  email?: string;
  name?: string;
  picture?: string;
  email_verified?: boolean;
  [key: string]: unknown;
};

type UsuarioCompleto = {
  usuario_id: number;
  auth0_id: string;
  auth0_user_id?: string | null;
  username: string;
  email: string;
  estado: string;
  auth_provider?: string | null;
  email_verified?: boolean | null;
  last_login_at?: Date | null;
  created_at?: Date;
  updated_at?: Date | null;
  mom_rol: {
    rol_id: number;
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    is_critico?: boolean;
    rel_mom_rol__mom_permiso: Array<{
      mom_permiso: PermisoRaw;
    }>;
  };
  mom_trabajador?: {
    trabajador_id: number;
    nombre_completo: string;
    documento_identidad: string;
    telefono: string | null;
    email: string;
  } | null;
};

// Helper para ejecutar SQL directo (compatible con MySQL 5.5)
async function executeRawSQL(query: string, params: unknown[] = []): Promise<RawSQLResult[]> {
  try {
    const result = await prisma.$queryRawUnsafe(query, ...params);
    return result as RawSQLResult[];
  } catch (error) {
    console.error('❌ [SQL] Error ejecutando consulta:', error);
    throw error;
  }
}

/**
 * Servicio para sincronizar usuarios entre Auth0 y la base de datos Agromano
 * Adaptado para trabajar con MySQL 5.5 usando consultas SQL directas
 */
export class AgroManoUserSyncService {

  /**
   * Obtener o crear usuario local basado en datos de Auth0
   * @param auth0UserId - ID único de Auth0 (sub del token JWT)
   * @param auth0UserData - Datos del usuario desde el token JWT
   */
  static async getOrCreateUser(
    auth0UserId: string,
    auth0UserData: Auth0UserData
  ): Promise<UsuarioCompleto> {
    try {
      console.log(`🔍 Buscando usuario con Auth0 ID: ${auth0UserId}`);

      // 1. Buscar usuario existente por auth0_id usando SQL directo
      const usuarios = await executeRawSQL(`
        SELECT 
          u.usuario_id,
          u.auth0_id,
          u.auth0_user_id,
          u.username,
          u.email,
          u.estado,
          u.auth_provider,
          u.email_verified,
          u.last_login_at,
          u.rol_id,
          u.trabajador_id,
          u.created_at,
          u.updated_at,
          r.codigo as rol_codigo,
          r.nombre as rol_nombre,
          r.descripcion as rol_descripcion,
          r.is_critico,
          t.nombre_completo,
          t.documento_identidad,
          t.telefono,
          t.email as trabajador_email
        FROM mot_usuario u
        LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
        LEFT JOIN mom_trabajador t ON u.trabajador_id = t.trabajador_id
        WHERE u.auth0_id = ? AND u.deleted_at IS NULL
        LIMIT 1
      `, [auth0UserId]);

      if (usuarios.length > 0) {
        const usuario: any = usuarios[0];
        
        // Actualizar último login usando SQL directo
        await executeRawSQL(`
          UPDATE mot_usuario 
          SET last_login_at = NOW(),
              email_verified = ?,
              updated_at = NOW()
          WHERE usuario_id = ?
        `, [
          auth0UserData.email_verified ? 1 : 0,
          usuario.usuario_id
        ]);

        console.log(`✅ Usuario encontrado: ${usuario.username}`);
        
        // Obtener permisos del rol
        const permisos = await executeRawSQL(`
          SELECT 
            p.permiso_id,
            p.codigo,
            p.nombre,
            p.descripcion,
            p.categoria
          FROM rel_mom_rol__mom_permiso rp
          INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
          WHERE rp.rol_id = ? AND rp.deleted_at IS NULL
        `, [usuario.rol_id]);

        return {
          usuario_id: usuario.usuario_id,
          auth0_id: usuario.auth0_id,
          auth0_user_id: usuario.auth0_user_id,
          username: usuario.username,
          email: usuario.email,
          estado: usuario.estado,
          auth_provider: usuario.auth_provider,
          email_verified: usuario.email_verified,
          last_login_at: usuario.last_login_at,
          mom_rol: {
            rol_id: usuario.rol_id,
            codigo: usuario.rol_codigo,
            nombre: usuario.rol_nombre,
            descripcion: usuario.rol_descripcion,
            is_critico: usuario.is_critico,
            rel_mom_rol__mom_permiso: (permisos as PermisoRaw[]).map((p) => ({
              mom_permiso: {
                permiso_id: p.permiso_id,
                codigo: p.codigo,
                nombre: p.nombre,
                descripcion: p.descripcion,
                categoria: p.categoria
              }
            }))
          },
          mom_trabajador: usuario.trabajador_id ? {
            trabajador_id: usuario.trabajador_id,
            nombre_completo: usuario.nombre_completo,
            documento_identidad: usuario.documento_identidad,
            telefono: usuario.telefono,
            email: usuario.trabajador_email
          } : null,
          created_at: usuario.created_at,
          updated_at: usuario.updated_at
        };
      }

      // 2. Si no existe, crear nuevo usuario
      console.log(`➕ Creando nuevo usuario para Auth0 ID: ${auth0UserId}`);

      // Obtener rol por defecto usando SQL directo
      const roles = await executeRawSQL(`
        SELECT rol_id, codigo, nombre
        FROM mom_rol
        WHERE (codigo = 'EMPLEADO_CAMPO' OR codigo = 'ADMIN')
          AND is_activo = 1
        ORDER BY rol_id ASC
        LIMIT 1
      `);

      if (roles.length === 0) {
        throw new Error('❌ No se encontró un rol por defecto para asignar');
      }

      const rolPorDefecto: any = roles[0];
      const username = auth0UserData.email || `user_${auth0UserId.slice(-8)}`;

      // Crear el usuario usando SQL directo
      await executeRawSQL(`
        INSERT INTO mot_usuario (
          auth0_id,
          auth0_user_id,
          username,
          email,
          password_hash,
          rol_id,
          estado,
          auth_provider,
          email_verified,
          last_login_at,
          created_at,
          created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
      `, [
        auth0UserId,
        auth0UserId,
        username,
        auth0UserData.email || null,
        'AUTH0_MANAGED',
        rolPorDefecto.rol_id,
        'activo',
        'auth0',
        auth0UserData.email_verified ? 1 : 0,
        1 // Sistema
      ]);

      // Obtener el usuario recién creado
      const nuevosUsuarios = await executeRawSQL(`
        SELECT 
          u.usuario_id,
          u.auth0_id,
          u.username,
          u.email,
          u.estado,
          u.rol_id,
          r.codigo as rol_codigo,
          r.nombre as rol_nombre
        FROM mot_usuario u
        LEFT JOIN mom_rol r ON u.rol_id = r.rol_id
        WHERE u.auth0_id = ?
        LIMIT 1
      `, [auth0UserId]);

      const nuevoUsuario: any = nuevosUsuarios[0];

      console.log(`✅ Usuario creado exitosamente: ${nuevoUsuario.username}`);

      // Obtener permisos del rol
      const permisos = await executeRawSQL(`
        SELECT 
          p.permiso_id,
          p.codigo,
          p.nombre,
          p.descripcion,
          p.categoria
        FROM rel_mom_rol__mom_permiso rp
        INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
        WHERE rp.rol_id = ? AND rp.deleted_at IS NULL
      `, [nuevoUsuario.rol_id]);

      return {
        usuario_id: nuevoUsuario.usuario_id,
        auth0_id: nuevoUsuario.auth0_id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        estado: nuevoUsuario.estado,
        mom_rol: {
          rol_id: nuevoUsuario.rol_id,
          codigo: nuevoUsuario.rol_codigo,
          nombre: nuevoUsuario.rol_nombre,
          rel_mom_rol__mom_permiso: (permisos as PermisoRaw[]).map((p) => ({
            mom_permiso: {
              permiso_id: p.permiso_id,
              codigo: p.codigo,
              nombre: p.nombre,
              descripcion: p.descripcion,
              categoria: p.categoria
            }
          }))
        },
        mom_trabajador: null
      };

    } catch (error) {
      console.error('❌ [SYNC] Error sincronizando usuario:', error);
      throw error;
    }
  }
}
