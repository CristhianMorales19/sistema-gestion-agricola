/**
 * Script de prueba para la funcionalidad de gestión de usuarios y roles
 * Ejecutar con: npm run test-user-roles
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = `http://localhost:${process.env.PORT || 3001}/api`;

class UserRoleTestClient {
  private authToken: string = '';
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE;
  }

  /**
   * Configurar token de autenticación (debe ser obtenido de Auth0)
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Hacer request con autenticación
   */
  private async request(method: string, endpoint: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${endpoint}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error en ${method} ${endpoint}:`, error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtener lista de usuarios
   */
  async getUsers(filters: any = {}) {
    console.log('📋 Obteniendo lista de usuarios...');
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/admin/users${queryParams ? `?${queryParams}` : ''}`;
    
    const result = await this.request('GET', endpoint);
    console.log(`✅ ${result.data.total} usuarios encontrados`);
    return result;
  }

  /**
   * Obtener usuarios sin roles
   */
  async getUsersWithoutRoles() {
    console.log('👤 Obteniendo usuarios sin roles...');
    const result = await this.request('GET', '/admin/users/without-roles');
    console.log(`✅ ${result.data.users.length} usuarios sin roles encontrados`);
    return result;
  }

  /**
   * Obtener lista de roles disponibles
   */
  async getRoles() {
    console.log('🎭 Obteniendo lista de roles...');
    const result = await this.request('GET', '/admin/roles');
    console.log(`✅ ${result.data.total} roles disponibles`);
    
    // Mostrar roles disponibles
    result.data.roles.forEach((role: any) => {
      console.log(`  - ${role.name}: ${role.description || 'Sin descripción'}`);
    });
    
    return result;
  }

  /**
   * Obtener detalles de un usuario específico
   */
  async getUserById(userId: string) {
    console.log(`👤 Obteniendo detalles del usuario ${userId}...`);
    const result = await this.request('GET', `/admin/users/${userId}`);
    console.log(`✅ Usuario encontrado: ${result.data.user.email}`);
    
    if (result.data.roles.length > 0) {
      console.log('  Roles asignados:');
      result.data.roles.forEach((role: any) => {
        console.log(`    - ${role.name}`);
      });
    } else {
      console.log('  Sin roles asignados');
    }
    
    return result;
  }

  /**
   * Asignar roles a un usuario
   */
  async assignRoles(userId: string, roleIds: string[], reason?: string) {
    console.log(`🔧 Asignando roles al usuario ${userId}...`);
    const result = await this.request('PUT', `/admin/users/${userId}/roles`, {
      roleIds,
      reason: reason || 'Asignación de prueba'
    });
    
    console.log(`✅ Roles asignados exitosamente`);
    console.log(`  Roles actuales:`);
    result.data.roles.forEach((role: any) => {
      console.log(`    - ${role.name}`);
    });
    
    return result;
  }

  /**
   * Remover roles de un usuario
   */
  async removeRoles(userId: string, roleIds: string[], reason?: string) {
    console.log(`🗑️ Removiendo roles del usuario ${userId}...`);
    const result = await this.request('DELETE', `/admin/users/${userId}/roles`, {
      roleIds,
      reason: reason || 'Remoción de prueba'
    });
    
    console.log(`✅ Roles removidos exitosamente`);
    console.log(`  Roles restantes:`);
    result.data.roles.forEach((role: any) => {
      console.log(`    - ${role.name}`);
    });
    
    return result;
  }

  /**
   * Obtener historial de cambios de roles
   */
  async getRoleHistory(userId?: string) {
    console.log(`📚 Obteniendo historial de roles${userId ? ` para ${userId}` : ''}...`);
    const endpoint = userId ? `/admin/users/${userId}/role-history` : '/admin/role-history';
    const result = await this.request('GET', endpoint);
    
    console.log(`✅ ${result.data.total} registros de auditoría encontrados`);
    
    if (result.data.history.length > 0) {
      console.log('  Últimos cambios:');
      result.data.history.slice(0, 3).forEach((log: any) => {
        console.log(`    - ${log.accion} en ${new Date(log.fecha_at).toLocaleString()}`);
      });
    }
    
    return result;
  }

  /**
   * Sincronizar usuarios desde Auth0
   */
  async syncUsers() {
    console.log('🔄 Sincronizando usuarios desde Auth0...');
    const result = await this.request('POST', '/admin/sync/users');
    console.log(`✅ ${result.data.syncedUsers} usuarios sincronizados`);
    
    if (result.data.errors.length > 0) {
      console.log(`⚠️ ${result.data.errorsCount} errores encontrados`);
    }
    
    return result;
  }

  /**
   * Verificar integridad de datos
   */
  async verifyIntegrity() {
    console.log('🔍 Verificando integridad de datos...');
    const result = await this.request('GET', '/admin/sync/integrity');
    
    console.log(`📊 Estadísticas de integridad:`);
    console.log(`  - Usuarios en Auth0: ${result.data.auth0UsersCount}`);
    console.log(`  - Usuarios locales: ${result.data.localUsersCount}`);
    console.log(`  - Usuarios huérfanos: ${result.data.orphanedLocalUsers.length}`);
    console.log(`  - Usuarios sin sincronizar: ${result.data.missingLocalUsers.length}`);
    
    return result;
  }

  /**
   * Obtener estadísticas de sincronización
   */
  async getSyncStats() {
    console.log('📈 Obteniendo estadísticas de sincronización...');
    const result = await this.request('GET', '/admin/sync/stats');
    
    console.log(`📊 Estadísticas:`);
    console.log(`  - Usuarios Auth0: ${result.data.auth0Users}`);
    console.log(`  - Usuarios locales: ${result.data.localUsers}`);
    console.log(`  - Porcentaje sincronización: ${result.data.syncPercentage}%`);
    console.log(`  - Estado: ${result.data.integrityStatus}`);
    
    return result;
  }
}

/**
 * Función principal de prueba
 */
async function runTests() {
  console.log('🚀 Iniciando pruebas de gestión de usuarios y roles\n');

  const client = new UserRoleTestClient();

  // Nota: En un entorno real, el token sería obtenido del login Auth0
  const testToken = 'YOUR_AUTH0_TOKEN_HERE';
  
  if (testToken === 'YOUR_AUTH0_TOKEN_HERE') {
    console.log('❌ Por favor, configura un token Auth0 válido en el script');
    console.log('💡 Obtén un token desde Auth0 y reemplaza YOUR_AUTH0_TOKEN_HERE');
    return;
  }

  client.setAuthToken(testToken);

  try {
    // 1. Obtener estadísticas iniciales
    await client.getSyncStats();
    console.log('\\n' + '='.repeat(50) + '\\n');

    // 2. Verificar integridad
    await client.verifyIntegrity();
    console.log('\\n' + '='.repeat(50) + '\\n');

    // 3. Obtener lista de roles disponibles
    const rolesResult = await client.getRoles();
    console.log('\\n' + '='.repeat(50) + '\\n');

    // 4. Obtener usuarios
    const usersResult = await client.getUsers({ page: 0, perPage: 5 });
    console.log('\\n' + '='.repeat(50) + '\\n');

    // 5. Obtener usuarios sin roles
    await client.getUsersWithoutRoles();
    console.log('\\n' + '='.repeat(50) + '\\n');

    // 6. Si hay usuarios y roles disponibles, hacer una prueba de asignación
    if (usersResult.data.users.length > 0 && rolesResult.data.roles.length > 0) {
      const testUser = usersResult.data.users[0];
      const testRole = rolesResult.data.roles[0];

      console.log(`🧪 Realizando prueba de asignación con:`);
      console.log(`   Usuario: ${testUser.user.email}`);
      console.log(`   Rol: ${testRole.name}`);

      // Obtener detalles del usuario antes de la asignación
      await client.getUserById(testUser.user.user_id);
      console.log('\\n' + '-'.repeat(30) + '\\n');

      // Asignar rol (solo si es seguro hacerlo)
      console.log('⚠️  NOTA: La asignación de roles está comentada para evitar cambios accidentales');
      console.log('💡 Descomenta las líneas siguientes para probar la asignación real');
      
      /*
      await client.assignRoles(
        testUser.user.user_id, 
        [testRole.id],
        'Prueba automatizada de asignación'
      );
      console.log('\\n' + '-'.repeat(30) + '\\n');

      // Verificar cambios
      await client.getUserById(testUser.user.user_id);
      console.log('\\n' + '-'.repeat(30) + '\\n');

      // Obtener historial
      await client.getRoleHistory(testUser.user.user_id);
      */
    }

    console.log('\\n' + '='.repeat(50));
    console.log('✅ Todas las pruebas completadas exitosamente');

  } catch (error) {
    console.error('\\n❌ Error durante las pruebas:', error);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTests();
}

export { UserRoleTestClient };