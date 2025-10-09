<<<<<<< HEAD
=======
// @ts-nocheck
>>>>>>> 5a7c7fa (Primer commit)
import { PrismaClient } from '@prisma/client';
import hybridAuthSyncMiddleware from './middleware/hybrid-auth-sync.middleware';
// Si usas require/module, instala los tipos: npm i --save-dev @types/node

/**
 * Script para probar la conexión y configuración de la base de datos
 * Ejecutar con: npx ts-node test-database-setup.ts
 */

const prisma = new PrismaClient();

async function testDatabaseSetup() {
  console.log('🔍 Probando configuración de la base de datos...\n');

  try {
    // 1. Verificar conexión a la BD
    console.log('1. ✅ Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('   ✅ Conexión exitosa\n');

    // 2. Verificar usuarios administrativos
    console.log('2. 👥 Verificando usuarios administrativos...');
    const usuarios = await prisma.mot_usuario.findMany({
      where: {
        username: {
          contains: '@agromano.com'
        }
      },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              include: {
                mom_permiso: true
              }
            }
          }
        }
      }
    });

    if (usuarios.length === 0) {
      console.log('   ⚠️  No se encontraron usuarios administrativos');
      console.log('   💡 Ejecuta el script SQL de setup primero\n');
      return;
    }

    usuarios.forEach(usuario => {
      const permisos = usuario.mom_rol?.rel_mom_rol__mom_permiso || [];
      console.log(`   ✅ ${usuario.username}`);
      console.log(`      Rol: ${usuario.mom_rol?.nombre || 'Sin rol'}`);
      console.log(`      Permisos: ${permisos.length}`);
    });
    console.log('');

    // 3. Verificar roles y permisos
    console.log('3. 🔐 Verificando roles y permisos...');
    const roles = await prisma.mom_rol.findMany({
      where: {
        codigo: {
          in: ['ADMIN_AGROMANO', 'SUPERVISOR_CAMPO', 'GERENTE_RRHH', 'SUPERVISOR_RRHH']
        }
      },
      include: {
        rel_mom_rol__mom_permiso: {
          include: {
            mom_permiso: true
          }
        }
      }
    });

    roles.forEach(rol => {
      console.log(`   ✅ ${rol.codigo}: ${rol.nombre}`);
      console.log(`      Permisos: ${rol.rel_mom_rol__mom_permiso.length}`);
    });
    console.log('');

    // 4. Verificar algunos permisos específicos
    console.log('4. ⚡ Verificando permisos específicos...');
    const permisosEspecificos = await prisma.mom_permiso.findMany({
      where: {
        codigo: {
          in: ['trabajadores:read:all', 'nomina:process', 'asistencia:approve']
        }
      }
    });

    permisosEspecificos.forEach(permiso => {
      console.log(`   ✅ ${permiso.codigo}: ${permiso.nombre}`);
    });
    console.log('');

    // 5. Verificar datos de piña
    console.log('5. 🍍 Verificando datos de piña...');
    const cultivos = await prisma.mom_cultivo.findMany({
      where: {
        nombre: {
          contains: 'Piña'
        }
      }
    });

    const tareas = await prisma.mom_tarea.findMany({
      where: {
        mom_cultivo: {
          nombre: 'Piña'
        }
      },
      include: {
        mom_cultivo: true
      }
    });

    console.log(`   ✅ Cultivos de piña: ${cultivos.length}`);
    console.log(`   ✅ Tareas de piña: ${tareas.length}`);

    if (cultivos.length > 0) {
      cultivos.forEach(cultivo => {
        console.log(`      - ${cultivo.nombre}: ${cultivo.descripcion}`);
      });
    }
    console.log('');

    // 6. Simular validación de usuario (como en el middleware)
    console.log('6. 🧪 Simulando validación de usuario...');
    const testEmail = 'admin@agromano.com';
    
    const usuario = await prisma.mot_usuario.findUnique({
      where: { username: testEmail },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              include: {
                mom_permiso: true
              }
            }
          }
        }
      }
    });

    if (usuario && usuario.mom_rol) {
      const permisos = usuario.mom_rol.rel_mom_rol__mom_permiso.map(rp => rp.mom_permiso.codigo);
      console.log(`   ✅ Usuario encontrado: ${usuario.username}`);
      console.log(`   ✅ Rol: ${usuario.mom_rol.nombre}`);
      console.log(`   ✅ Total permisos: ${permisos.length}`);
      console.log(`   ✅ Algunos permisos: ${permisos.slice(0, 3).join(', ')}...`);
    } else {
      console.log(`   ❌ Usuario ${testEmail} no encontrado`);
    }
    console.log('');

    console.log('🎉 ¡Configuración de base de datos verificada exitosamente!');
    console.log('📧 Emails para crear en Auth0:');
    usuarios.forEach(u => console.log(`   - ${u.username}`));

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}


/**
 * Prueba del middleware híbrido: simula validación de usuario y fallback a BD
 */
async function testHybridMiddleware() {
  // Simula un request con token Auth0 válido
  const req: any = {
    auth: {
      sub: 'auth0|68b8a6d1bf1669b349577af6',
      email: 'admin@agromano.com',
      permissions: ['admin:access', 'trabajadores:read:all']
    },
    body: {}
  };
  const res: any = {
    status: (code: number) => ({ json: (obj: any) => console.log(`Res(${code}):`, obj) }),
    json: (obj: any) => console.log('Res:', obj)
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  console.log('\n🧪 Probando middleware híbrido con token Auth0 válido...');
  await hybridAuthSyncMiddleware(req, res, next);
  if (nextCalled) {
    console.log('✅ Middleware permitió acceso. Usuario:', req.dbUser?.username);
    console.log('✅ Permisos:', req.userPermissions);
  }

  // Simula un request sin token Auth0, pero con email en el body
  const req2: any = {
    body: { email: 'admin@agromano.com' }
  };
  let nextCalled2 = false;
  const next2 = () => { nextCalled2 = true; };
  console.log('\n🧪 Probando middleware híbrido SIN token Auth0, solo BD...');
  await hybridAuthSyncMiddleware(req2, res, next2);
  if (nextCalled2) {
    console.log('✅ Middleware permitió acceso solo por BD. Usuario:', req2.dbUser?.username);
    console.log('✅ Permisos:', req2.userPermissions);
  }
}

// Ejecutar pruebas si es llamado directamente
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  (async () => {
    await testDatabaseSetup();
    await testHybridMiddleware();
  })();
}

export { testDatabaseSetup };

/**
 * Prueba del middleware híbrido: simula validación de usuario y fallback a BD
 */
import hybridAuthSyncMiddleware from './middleware/hybrid-auth-sync.middleware';

async function testHybridMiddleware() {
  // Simula un request con token Auth0 válido
  const req: any = {
    auth: {
      sub: 'auth0|68b8a6d1bf1669b349577af6',
      email: 'admin@agromano.com',
      permissions: ['admin:access', 'trabajadores:read:all']
    },
    body: {}
  };
  const res: any = {
    status: (code: number) => ({ json: (obj: any) => console.log(`Res(${code}):`, obj) }),
    json: (obj: any) => console.log('Res:', obj)
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  console.log('\n🧪 Probando middleware híbrido con token Auth0 válido...');
  await hybridAuthSyncMiddleware(req, res, next);
  if (nextCalled) {
    console.log('✅ Middleware permitió acceso. Usuario:', req.dbUser?.username);
    console.log('✅ Permisos:', req.userPermissions);
  }

  // Simula un request sin token Auth0, pero con email en el body
  const req2: any = {
    body: { email: 'admin@agromano.com' }
  };
  let nextCalled2 = false;
  const next2 = () => { nextCalled2 = true; };
  console.log('\n🧪 Probando middleware híbrido SIN token Auth0, solo BD...');
  await hybridAuthSyncMiddleware(req2, res, next2);
  if (nextCalled2) {
    console.log('✅ Middleware permitió acceso solo por BD. Usuario:', req2.dbUser?.username);
    console.log('✅ Permisos:', req2.userPermissions);
  }
}

// Ejecutar prueba del middleware híbrido si es llamado directamente
if (require.main === module) {
  testHybridMiddleware();
}
import { PrismaClient } from '@prisma/client';
import hybridAuthSyncMiddleware from './middleware/hybrid-auth-sync.middleware';

/**
 * Script para probar la conexión y configuración de la base de datos
 * Ejecutar con: npx ts-node test-database-setup.ts
 */

const prisma = new PrismaClient();

async function testDatabaseSetup() {
  console.log('🔍 Probando configuración de la base de datos...\n');

  try {
    // 1. Verificar conexión a la BD
    console.log('1. ✅ Verificando conexión a la base de datos...');
    await prisma.$connect();
    console.log('   ✅ Conexión exitosa\n');

    // 2. Verificar usuarios administrativos
    console.log('2. 👥 Verificando usuarios administrativos...');
    const usuarios = await prisma.mot_usuario.findMany({
      where: {
        username: {
          contains: '@agromano.com'
        }
      },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              include: {
                mom_permiso: true
              }
            }
          }
        }
      }
    });

    if (usuarios.length === 0) {
      console.log('   ⚠️  No se encontraron usuarios administrativos');
      console.log('   💡 Ejecuta el script SQL de setup primero\n');
      return;
    }

    usuarios.forEach(usuario => {
      const permisos = usuario.mom_rol?.rel_mom_rol__mom_permiso || [];
      console.log(`   ✅ ${usuario.username}`);
      console.log(`      Rol: ${usuario.mom_rol?.nombre || 'Sin rol'}`);
      console.log(`      Permisos: ${permisos.length}`);
    });
    console.log('');

    // 3. Verificar roles y permisos
    console.log('3. 🔐 Verificando roles y permisos...');
    const roles = await prisma.mom_rol.findMany({
      where: {
        codigo: {
          in: ['ADMIN_AGROMANO', 'SUPERVISOR_CAMPO', 'GERENTE_RRHH', 'SUPERVISOR_RRHH']
        }
      },
      include: {
        rel_mom_rol__mom_permiso: {
          include: {
            mom_permiso: true
          }
        }
      }
    });

    roles.forEach(rol => {
      console.log(`   ✅ ${rol.codigo}: ${rol.nombre}`);
      console.log(`      Permisos: ${rol.rel_mom_rol__mom_permiso.length}`);
    });
    console.log('');

    // 4. Verificar algunos permisos específicos
    console.log('4. ⚡ Verificando permisos específicos...');
    const permisosEspecificos = await prisma.mom_permiso.findMany({
      where: {
        codigo: {
          in: ['trabajadores:read:all', 'nomina:process', 'asistencia:approve']
        }
      }
    });

    permisosEspecificos.forEach(permiso => {
      console.log(`   ✅ ${permiso.codigo}: ${permiso.nombre}`);
    });
    console.log('');

    // 5. Verificar datos de piña
    console.log('5. 🍍 Verificando datos de piña...');
    const cultivos = await prisma.mom_cultivo.findMany({
      where: {
        nombre: {
          contains: 'Piña'
        }
      }
    });

    const tareas = await prisma.mom_tarea.findMany({
      where: {
        mom_cultivo: {
          nombre: 'Piña'
        }
      },
      include: {
        mom_cultivo: true
      }
    });

    console.log(`   ✅ Cultivos de piña: ${cultivos.length}`);
    console.log(`   ✅ Tareas de piña: ${tareas.length}`);

    if (cultivos.length > 0) {
      cultivos.forEach(cultivo => {
        console.log(`      - ${cultivo.nombre}: ${cultivo.descripcion}`);
      });
    }
    console.log('');

    // 6. Simular validación de usuario (como en el middleware)
    console.log('6. 🧪 Simulando validación de usuario...');
    const testEmail = 'admin@agromano.com';
    
    const usuario = await prisma.mot_usuario.findUnique({
      where: { username: testEmail },
      include: {
        mom_rol: {
          include: {
            rel_mom_rol__mom_permiso: {
              include: {
                mom_permiso: true
              }
            }
          }
        }
      }
    });

    if (usuario && usuario.mom_rol) {
      const permisos = usuario.mom_rol.rel_mom_rol__mom_permiso.map(rp => rp.mom_permiso.codigo);
      console.log(`   ✅ Usuario encontrado: ${usuario.username}`);
      console.log(`   ✅ Rol: ${usuario.mom_rol.nombre}`);
      console.log(`   ✅ Total permisos: ${permisos.length}`);
      console.log(`   ✅ Algunos permisos: ${permisos.slice(0, 3).join(', ')}...`);
    } else {
      console.log(`   ❌ Usuario ${testEmail} no encontrado`);
    }
    console.log('');

    console.log('🎉 ¡Configuración de base de datos verificada exitosamente!');
    console.log('📧 Emails para crear en Auth0:');
    usuarios.forEach(u => console.log(`   - ${u.username}`));

  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}


/**
 * Prueba del middleware híbrido: simula validación de usuario y fallback a BD
 */
async function testHybridMiddleware() {
  // Simula un request con token Auth0 válido
  const req: any = {
    auth: {
      sub: 'auth0|68b8a6d1bf1669b349577af6',
      email: 'admin@agromano.com',
      permissions: ['admin:access', 'trabajadores:read:all']
    },
    body: {}
  };
  const res: any = {
    status: (code: number) => ({ json: (obj: any) => console.log(`Res(${code}):`, obj) }),
    json: (obj: any) => console.log('Res:', obj)
  };
  let nextCalled = false;
  const next = () => { nextCalled = true; };

  console.log('\n🧪 Probando middleware híbrido con token Auth0 válido...');
  await hybridAuthSyncMiddleware(req, res, next);
  if (nextCalled) {
    console.log('✅ Middleware permitió acceso. Usuario:', req.dbUser?.username);
    console.log('✅ Permisos:', req.userPermissions);
  }

  // Simula un request sin token Auth0, pero con email en el body
  const req2: any = {
    body: { email: 'admin@agromano.com' }
  };
  let nextCalled2 = false;
  const next2 = () => { nextCalled2 = true; };
  console.log('\n🧪 Probando middleware híbrido SIN token Auth0, solo BD...');
  await hybridAuthSyncMiddleware(req2, res, next2);
  if (nextCalled2) {
    console.log('✅ Middleware permitió acceso solo por BD. Usuario:', req2.dbUser?.username);
    console.log('✅ Permisos:', req2.userPermissions);
  }
}

// Ejecutar ambas pruebas si es llamado directamente
if (typeof require !== 'undefined' && typeof module !== 'undefined' && require.main === module) {
  (async () => {
    await testDatabaseSetup();
    await testHybridMiddleware();
    await prisma.$disconnect();
  })();
}

export { testDatabaseSetup };
