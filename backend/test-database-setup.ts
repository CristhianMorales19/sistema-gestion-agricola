import { PrismaClient } from '@prisma/client';

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

// Ejecutar si es llamado directamente
if (require.main === module) {
  testDatabaseSetup();
}

export { testDatabaseSetup };
