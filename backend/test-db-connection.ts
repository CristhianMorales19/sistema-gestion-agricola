import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Probando conexión a la base de datos AgroMano...');
    
    // Probar conexión básica
    await prisma.$connect();
    console.log('✅ Conexión establecida exitosamente');
    
    // Contar registros en algunas tablas principales
    const trabajadores = await prisma.mom_trabajador.count();
    const roles = await prisma.mom_rol.count();
    const cultivos = await prisma.mom_cultivo.count();
    const parcelas = await prisma.mom_parcela.count();
    
    console.log('📊 Resumen de la base de datos:');
    console.log(`   - Trabajadores: ${trabajadores}`);
    console.log(`   - Roles: ${roles}`);
    console.log(`   - Cultivos: ${cultivos}`);
    console.log(`   - Parcelas: ${parcelas}`);
    
    // Mostrar información de conexión
    console.log('🔗 Configuración de conexión:');
    console.log(`   - Host: ${process.env.DB_HOST}`);
    console.log(`   - Puerto: ${process.env.DB_PORT}`);
    console.log(`   - Base de datos: ${process.env.DB_NAME}`);
    console.log(`   - Usuario: ${process.env.DB_USER}`);
    
    console.log('🎉 ¡La base de datos AgroMano está lista para usar!');
    
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testConnection();
