/**
 * Script de diagnóstico para verificar la conexión con Auth0 Management API
 * 
 * Este script intenta conectarse a Auth0 y verificar permisos del Management API
 */

import { ManagementClient } from 'auth0';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const testAuth0Management = async () => {
  console.log('🔍 Iniciando diagnóstico de Auth0 Management API...\n');

  // Verificar variables de entorno
  console.log('📋 Verificando configuración:');
  const domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;

  if (!domain) {
    console.error('❌ AUTH0_DOMAIN no está definido');
    return;
  }
  if (!clientId) {
    console.error('❌ AUTH0_CLIENT_ID no está definido');
    return;
  }
  if (!clientSecret) {
    console.error('❌ AUTH0_CLIENT_SECRET no está definido');
    return;
  }

  console.log(`✅ AUTH0_DOMAIN: ${domain}`);
  console.log(`✅ AUTH0_CLIENT_ID: ${clientId.substring(0, 8)}...`);
  console.log(`✅ AUTH0_CLIENT_SECRET: ${clientSecret.substring(0, 8)}...\n`);

  try {
    // Crear cliente de Management API
    console.log('🔌 Creando cliente de Management API...');
    const management = new ManagementClient({
      domain,
      clientId,
      clientSecret
    });

    console.log('✅ Cliente creado exitosamente\n');

    // Test 1: Obtener roles
    console.log('🧪 Test 1: Obteniendo roles...');
    try {
      const roles = await management.roles.getAll({ per_page: 5 });
      console.log(`✅ Roles obtenidos: ${(roles as any).length || (roles as any).data?.length || 0} roles encontrados`);
      if ((roles as any).length > 0 || (roles as any).data?.length > 0) {
        const roleList = (roles as any).data || roles;
        console.log(`   Primeros roles:`, roleList.slice(0, 3).map((r: any) => r.name).join(', '));
      }
    } catch (error: any) {
      console.error('❌ Error obteniendo roles:', error.message);
      console.error('   Status:', error.statusCode);
      console.error('   Detalles:', error.originalError?.message || 'N/A');
    }

    // Test 2: Obtener usuarios
    console.log('\n🧪 Test 2: Obteniendo usuarios...');
    try {
      const users = await management.users.getAll({ per_page: 5 });
      console.log(`✅ Usuarios obtenidos: ${(users as any).length || (users as any).data?.length || 0} usuarios encontrados`);
      if ((users as any).length > 0 || (users as any).data?.length > 0) {
        const userList = (users as any).data || users;
        console.log(`   Primeros usuarios:`, userList.slice(0, 3).map((u: any) => u.email || u.name).join(', '));
      }
    } catch (error: any) {
      console.error('❌ Error obteniendo usuarios:', error.message);
      console.error('   Status:', error.statusCode);
      console.error('   Detalles:', error.originalError?.message || 'N/A');
    }

    // Test 3: Obtener información de la aplicación
    console.log('\n🧪 Test 3: Obteniendo información de la aplicación...');
    try {
      const client = await management.clients.get({ client_id: clientId });
      console.log(`✅ Aplicación encontrada: ${(client as any).name || (client as any).data?.name}`);
      console.log(`   Tipo: ${(client as any).app_type || (client as any).data?.app_type}`);
    } catch (error: any) {
      console.error('❌ Error obteniendo información de la aplicación:', error.message);
      console.error('   Status:', error.statusCode);
      console.error('   Detalles:', error.originalError?.message || 'N/A');
    }

    console.log('\n✅ Diagnóstico completado');

  } catch (error: any) {
    console.error('\n❌ Error crítico durante el diagnóstico:', error.message);
    console.error('Stack:', error.stack);
  }
};

// Ejecutar el diagnóstico
testAuth0Management().catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
