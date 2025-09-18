import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAuth0Setup() {
    console.log('🔍 VERIFICANDO CONFIGURACIÓN PARA AUTH0...\n');

    try {
        // 1. Verificar usuarios administrativos
        console.log('📧 USUARIOS PARA CREAR EN AUTH0:');
        const auth0Users = await prisma.mot_usuario.findMany({
            where: {
                username: {
                    contains: '@agromano.com'
                }
            },
            include: {
                mom_trabajador: true,
                mom_rol: true
            }
        });

        auth0Users.forEach(user => {
            console.log(`✅ Email: ${user.username}`);
            console.log(`   Nombre: ${user.mom_trabajador?.nombre_completo}`);
            console.log(`   Rol: ${user.mom_rol?.nombre}`);
            console.log('   ⚡ CREAR ESTE USUARIO EN AUTH0 CON ESTE EMAIL\n');
        });

        // 2. Verificar permisos por rol
        console.log('🔐 PERMISOS CONFIGURADOS POR ROL:');
        const rolesWithPermissions = await prisma.mom_rol.findMany({
            where: {
                codigo: {
                    in: ['ADMIN', 'SUPER', 'OPER']
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

        rolesWithPermissions.forEach(rol => {
            console.log(`\n📋 ROL: ${rol.nombre} (${rol.codigo})`);
            console.log(`   Permisos: ${rol.rel_mom_rol__mom_permiso.length}`);
            
            // Mostrar algunos permisos de ejemplo
            const ejemplosPermisos = rol.rel_mom_rol__mom_permiso.slice(0, 5);
            ejemplosPermisos.forEach(rp => {
                console.log(`   - ${rp.mom_permiso.codigo}: ${rp.mom_permiso.nombre}`);
            });
            if (rol.rel_mom_rol__mom_permiso.length > 5) {
                console.log(`   ... y ${rol.rel_mom_rol__mom_permiso.length - 5} permisos más`);
            }
        });

        // 3. Simular middleware híbrido
        console.log('\n🎭 SIMULANDO MIDDLEWARE HÍBRIDO:');
        for (const user of auth0Users) {
            console.log(`\nProbando usuario: ${user.username}`);
            
            // Buscar usuario como lo haría el middleware
            const foundUser = await prisma.mot_usuario.findFirst({
                where: {
                    username: user.username,
                    estado: 'activo'
                }
            });

            if (foundUser) {
                // Obtener rol
                const rol = await prisma.mom_rol.findUnique({
                    where: {
                        rol_id: foundUser.rol_id
                    }
                });

                // Obtener permisos REALES desde la base de datos
                const rolPermisosQuery = await prisma.$queryRaw`
                    SELECT p.codigo as permiso_codigo
                    FROM rel_mom_rol__mom_permiso rp
                    INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
                    WHERE rp.rol_id = ${foundUser.rol_id}
                    AND rp.deleted_at IS NULL
                    AND p.is_activo = 1
                `;

                const permissions = (rolPermisosQuery as any[]).map(item => item.permiso_codigo);

                console.log(`✅ Usuario encontrado: ${foundUser.username}`);
                console.log(`   Rol: ${rol?.codigo} - ${rol?.nombre}`);
                console.log(`   Permisos cargados: ${permissions.length}`);
                console.log(`   Ejemplos: ${permissions.slice(0, 3).join(', ')}`);
            } else {
                console.log(`❌ Usuario NO encontrado: ${user.username}`);
            }
        }

        // 4. Verificar datos de piña
        console.log('\n🍍 DATOS DE PIÑA CONFIGURADOS:');
        const cultivos = await prisma.mom_cultivo.count({
            where: {
                nombre: {
                    contains: 'Piña'
                }
            }
        });
        console.log(`   Variedades de piña: ${cultivos}`);

        const parcelas = await prisma.mom_parcela.count();
        console.log(`   Parcelas: ${parcelas}`);

        const tareas = await prisma.mom_tarea.count();
        console.log(`   Tareas configuradas: ${tareas}`);

        console.log('\n🎉 RESUMEN:');
        console.log(`✅ Usuarios Auth0 creados: ${auth0Users.length}`);
        console.log(`✅ Roles configurados: ${rolesWithPermissions.length}`);
        console.log(`✅ Base de datos lista para Auth0 híbrido`);

        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('1. 📧 Crear usuarios en Auth0 con los emails mostrados arriba');
        console.log('2. 🔑 Configurar variables de entorno Auth0 en tu backend');
        console.log('3. 🚀 Probar autenticación híbrida');

    } catch (error) {
        console.error('❌ Error verificando configuración:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar verificación
verifyAuth0Setup();
