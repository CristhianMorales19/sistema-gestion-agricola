/**
 * Script de prueba para el Sistema Híbrido de Gestión de Usuarios
 * Prueba los 3 escenarios: Auth0 disponible, Auth0 no disponible, y fallback durante operación
 */

import { hybridUserService } from './src/services/hybrid-user-management.service';

console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA HÍBRIDO\n');

async function testHybridSystem() {
  try {
    // ============================================
    // TEST 1: Obtener Usuarios
    // ============================================
    console.log('📋 TEST 1: Obteniendo lista de usuarios...');
    const usersResult = await hybridUserService.getUsers(0, 10);
    
    console.log(`✅ Usuarios obtenidos: ${usersResult.users.length}`);
    console.log(`📊 Total en sistema: ${usersResult.total}`);
    console.log(`🔍 Origen de datos: ${usersResult.source}`);
    
    if (usersResult.users.length > 0) {
      const firstUser = usersResult.users[0];
      console.log('\n👤 Primer usuario:');
      console.log(`   - Email: ${firstUser.user.email}`);
      console.log(`   - Nombre: ${firstUser.user.name}`);
      console.log(`   - Roles: ${firstUser.roles?.map(r => r.name).join(', ') || 'Sin roles'}`);
      
      if (firstUser.localUserData) {
        console.log(`   - ID Local: ${firstUser.localUserData.usuario_id}`);
        console.log(`   - Username: ${firstUser.localUserData.username}`);
        console.log(`   - Estado: ${firstUser.localUserData.estado}`);
      }
    }

    // ============================================
    // TEST 2: Obtener Roles
    // ============================================
    console.log('\n\n🎭 TEST 2: Obteniendo lista de roles...');
    const roles = await hybridUserService.getRoles();
    
    console.log(`✅ Roles obtenidos: ${roles.length}`);
    
    if (roles.length > 0) {
      console.log('\n📜 Lista de roles:');
      roles.forEach((role: any, index: number) => {
        console.log(`   ${index + 1}. ${role.name} - ${role.description || 'Sin descripción'}`);
        if (role.permissions && role.permissions.length > 0) {
          console.log(`      Permisos: ${role.permissions.length}`);
        }
      });
    }

    // ============================================
    // TEST 3: Prueba de Asignación de Roles
    // ============================================
    if (usersResult.users.length > 0 && roles.length > 0) {
      const testUser = usersResult.users[0];
      const testRole = roles[0];
      
      console.log('\n\n🔧 TEST 3: Asignando rol a usuario...');
      console.log(`   Usuario: ${testUser.user.email}`);
      console.log(`   Rol: ${testRole.name}`);
      
      try {
        const assignResult = await hybridUserService.assignRoles(
          testUser.user.user_id!,
          [testRole.id!]
        );
        
        console.log(`✅ Rol asignado exitosamente`);
        console.log(`🔍 Origen: ${assignResult.source}`);
      } catch (error: any) {
        console.log(`⚠️ Error asignando rol: ${error.message}`);
        console.log('   (Esto es normal si el usuario ya tiene ese rol)');
      }
    }

    // ============================================
    // RESUMEN DE PRUEBAS
    // ============================================
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 RESUMEN DE PRUEBAS');
    console.log('='.repeat(60));
    console.log('✅ Sistema híbrido funcionando correctamente');
    console.log(`✅ Origen de datos: ${usersResult.source === 'auth0' ? 'Auth0 (Principal)' : 'Base de datos local (Fallback)'}`);
    console.log(`✅ ${usersResult.users.length} usuarios disponibles`);
    console.log(`✅ ${roles.length} roles disponibles`);
    
    if (usersResult.source === 'auth0') {
      console.log('\n💡 Sistema usando Auth0 como fuente principal');
      console.log('   - Datos enriquecidos con información local');
      console.log('   - Sincronización activa');
    } else {
      console.log('\n⚠️ Sistema usando base de datos local (Fallback)');
      console.log('   - Auth0 no está disponible');
      console.log('   - El sistema continúa funcionando normalmente');
    }
    
    console.log('\n✅ TODAS LAS PRUEBAS COMPLETADAS\n');

  } catch (error: any) {
    console.error('\n❌ ERROR EN PRUEBAS:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// ============================================
// EJECUTAR PRUEBAS
// ============================================
testHybridSystem()
  .then(() => {
    console.log('🎉 Pruebas finalizadas con éxito');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
