/**
 * Script de prueba directa para verificar inserción en mot_asistencia
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testAsistenciaInsert() {
  try {
    console.log('🧪 Iniciando prueba de inserción en mot_asistencia...\n');

    // 1. Verificar que existe al menos un trabajador activo
    console.log('📋 Buscando trabajadores activos...');
    const trabajadores = await prisma.mom_trabajador.findMany({
      where: { is_activo: true },
      take: 1,
      select: {
        trabajador_id: true,
        documento_identidad: true,
        nombre_completo: true,
      }
    });

    if (trabajadores.length === 0) {
      console.error('❌ No hay trabajadores activos en la base de datos');
      return;
    }

    const trabajador = trabajadores[0];
    console.log(`✅ Trabajador encontrado: ${trabajador.documento_identidad} - ${trabajador.nombre_completo}\n`);

    // 2. Verificar si ya existe una entrada hoy para este trabajador
    const hoy = new Date();
    const fechaHoy = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), hoy.getUTCDate()));
    
    console.log('🔍 Verificando entradas existentes para hoy...');
    const existente = await prisma.mot_asistencia.findFirst({
      where: {
        trabajador_id: trabajador.trabajador_id,
        fecha_at: fechaHoy,
      }
    });

    if (existente) {
      console.log('⚠️  Ya existe una entrada hoy para este trabajador:', existente);
      console.log('\n🗑️  Eliminando entrada existente para prueba...');
      await prisma.mot_asistencia.delete({
        where: { asistencia_id: existente.asistencia_id }
      });
      console.log('✅ Entrada anterior eliminada\n');
    }

    // 3. Intentar insertar una nueva entrada
    console.log('📝 Intentando insertar nueva entrada de asistencia...');
    const createData = {
      trabajador_id: trabajador.trabajador_id,
      fecha_at: fechaHoy,
      hora_entrada_at: new Date(),
      ubicacion_entrada: 'Oficina Central - Prueba',
      hora_salida_at: null,
      horas_trabajadas: null,
      observaciones_salida: null,
      estado: 'incompleta',
      created_at: new Date(),
      created_by: 1,
      updated_at: null,
      updated_by: null,
      deleted_at: null,
    };

    console.log('📦 Datos a insertar:', JSON.stringify(createData, null, 2));
    console.log('');

    const resultado = await prisma.mot_asistencia.create({
      data: createData,
    });

    console.log('✅ ¡Entrada creada exitosamente!');
    console.log('📊 Resultado:', JSON.stringify(resultado, null, 2));
    console.log('');

    // 4. Verificar que se insertó correctamente
    console.log('🔍 Verificando entrada recién creada...');
    const verificacion = await prisma.mot_asistencia.findUnique({
      where: { asistencia_id: resultado.asistencia_id }
    });

    if (verificacion) {
      console.log('✅ Verificación exitosa:', verificacion);
    } else {
      console.log('❌ No se pudo verificar la entrada');
    }

    // 5. Limpiar (opcional)
    console.log('\n🧹 Limpiando entrada de prueba...');
    await prisma.mot_asistencia.delete({
      where: { asistencia_id: resultado.asistencia_id }
    });
    console.log('✅ Entrada de prueba eliminada\n');

    console.log('🎉 ¡Prueba completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    if (error instanceof Error) {
      console.error('📋 Detalle del error:', error.message);
      console.error('📚 Stack:', error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testAsistenciaInsert();
