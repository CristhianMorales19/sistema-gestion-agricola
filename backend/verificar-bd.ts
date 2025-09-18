import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verificarConexionBD() {
    try {
        console.log('🔍 Verificando conexión a la base de datos...');
        
        // Verificar conexión básica
        await prisma.$connect();
        console.log('✅ Conexión a BD establecida exitosamente');
        
        // Verificar usuarios existentes
        const usuarios = await prisma.mot_usuario.findMany({
            take: 5,
            select: {
                usuario_id: true,
                username: true,
                rol_id: true,
                estado: true,
                trabajador_id: true
            }
        });
        
        console.log('👥 Usuarios en la BD:', usuarios.length);
        usuarios.forEach(usuario => {
            console.log(`   - ID: ${usuario.usuario_id}, Username: ${usuario.username}, Rol: ${usuario.rol_id}, Estado: ${usuario.estado}`);
        });
        
        // Verificar roles
        const roles = await prisma.mom_rol.findMany({
            select: {
                rol_id: true,
                nombre: true,
                descripcion: true
            }
        });
        
        console.log('🎭 Roles disponibles:', roles.length);
        roles.forEach(rol => {
            console.log(`   - ID: ${rol.rol_id}, Nombre: ${rol.nombre}`);
        });
        
    } catch (error) {
        console.error('❌ Error verificando BD:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verificarConexionBD();
