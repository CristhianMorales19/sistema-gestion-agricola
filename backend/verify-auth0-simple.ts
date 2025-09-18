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
            }
        });

        console.log(`Encontrados ${auth0Users.length} usuarios administrativos:`);
        auth0Users.forEach((user, index) => {
            console.log(`${index + 1}. Email: ${user.username}`);
            console.log(`   ⚡ CREAR ESTE USUARIO EN AUTH0 CON ESTE EMAIL`);
        });

        // 2. Verificar permisos totales
        console.log('\n🔐 VERIFICANDO PERMISOS:');
        const totalPermisos = await prisma.mom_permiso.count({
            where: {
                is_activo: true
            }
        });
        console.log(`Total permisos disponibles: ${totalPermisos}`);

        // 3. Verificar permisos del rol ADMIN
        const adminPermissions = await prisma.$queryRaw`
            SELECT COUNT(*) as total
            FROM rel_mom_rol__mom_permiso rp
            INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
            WHERE rp.rol_id = 1
            AND rp.deleted_at IS NULL
            AND p.is_activo = 1
        `;
        
        console.log(`Permisos asignados al rol ADMIN: ${(adminPermissions as any)[0].total}`);

        // 4. Simular autenticación híbrida
        console.log('\n🎭 SIMULANDO MIDDLEWARE HÍBRIDO:');
        if (auth0Users.length > 0) {
            const testUser = auth0Users[0];
            console.log(`Probando con usuario: ${testUser.username}`);
            
            // Buscar usuario como lo haría el middleware
            const foundUser = await prisma.mot_usuario.findFirst({
                where: {
                    username: testUser.username,
                    estado: 'activo'
                }
            });

            if (foundUser) {
                console.log(`✅ Usuario encontrado en BD local`);
                
                // Obtener permisos como lo haría el middleware
                const userPermissions = await prisma.$queryRaw`
                    SELECT p.codigo as permiso_codigo
                    FROM rel_mom_rol__mom_permiso rp
                    INNER JOIN mom_permiso p ON rp.permiso_id = p.permiso_id
                    WHERE rp.rol_id = ${foundUser.rol_id}
                    AND rp.deleted_at IS NULL
                    AND p.is_activo = 1
                    LIMIT 5
                `;

                const permissions = (userPermissions as any[]).map(item => item.permiso_codigo);
                console.log(`✅ Permisos cargados: ${permissions.join(', ')}`);
            } else {
                console.log(`❌ Usuario NO encontrado en BD local`);
            }
        }

        // 5. Verificar datos básicos de piña
        console.log('\n🍍 DATOS DE CULTIVO:');
        const cultivosCount = await prisma.mom_cultivo.count();
        const parcelasCount = await prisma.mom_parcela.count();
        const tareasCount = await prisma.mom_tarea.count();
        
        console.log(`Cultivos: ${cultivosCount} | Parcelas: ${parcelasCount} | Tareas: ${tareasCount}`);

        console.log('\n🎉 CONFIGURACIÓN COMPLETADA EXITOSAMENTE');
        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('1. 📧 Crear usuarios en Auth0 con los emails mostrados arriba');
        console.log('2. 🔑 Configurar variables Auth0 en tu .env');
        console.log('3. 🚀 Probar el login híbrido');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyAuth0Setup();
