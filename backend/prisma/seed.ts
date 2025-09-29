import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds de la base de datos...');

  // Limpiar datos existentes (opcional - ten cuidado en producción)
  console.log('🧹 Limpiando datos existentes...');
  const modelNames = [
    'rel_mom_tarea__mom_esquema_pago',
    'rel_mom_rol__mom_permiso',
    'rel_mom_parcela__mom_cultivo',
    'rel_mom_cuadrilla__mom_trabajador',
    'mot_usuario',
    'mot_tarea_programada',
    'mot_registro_productividad',
    'mot_recibo',
    'mot_liquidacion',
    'mot_info_laboral',
    'mot_deduccion_especial',
    'mot_condiciones_trabajo',
    'mot_concepto_liquidacion',
    'mot_ausencia_justificada',
    'mot_asistencia',
    'mot_asignacion_tarea',
    'mot_asignacion_cultivo_parcela',
    'mot_asignacion_cuadrilla',
    'moh_trabajador_historial',
    'mol_audit_log',
    'mom_trabajador',
    'mom_tarea',
    'mom_rol',
    'mom_permiso',
    'mom_periodo_nomina',
    'mom_parcela',
    'mom_formula_pago',
    'mom_esquema_pago',
    'mom_deduccion_especial_tipo',
    'mom_cultivo',
    'mom_cuadrilla',
    'mom_bonificacion'
  ];

  for (const modelName of modelNames) {
    try {
      await (prisma as any)[modelName].deleteMany();
      console.log(`✅ ${modelName} limpiado`);
    } catch (error) {
      if (error instanceof Error) {
          console.log(`⚠️  No se pudo limpiar ${modelName}:`, error.message);
      } else {
          console.log(`⚠️  No se pudo limpiar ${modelName}:`, String(error));
      }
    }
  }

  // Crear permisos
  console.log('🔐 Creando permisos...');
  const permisos = await prisma.mom_permiso.createMany({
    data: [
      { nombre: 'ver_dashboard', categoria: 'dashboard', descripcion: 'Ver panel de control', created_at: new Date(), created_by: 1},
      { nombre: 'gestionar_empleados', categoria: 'empleados', descripcion: 'Gestionar empleados', created_at: new Date(), created_by: 1},
      { nombre: 'gestionar_nominas', categoria: 'nominas', descripcion: 'Gestionar nóminas', created_at: new Date(), created_by: 1},
      { nombre: 'gestionar_parcelas', categoria: 'parcelas', descripcion: 'Gestionar parcelas', created_at: new Date(), created_by: 1},
      { nombre: 'ver_reportes', categoria: 'reportes', descripcion: 'Ver reportes', created_at: new Date(), created_by: 1}
    ]
  });

  // Crear roles
  console.log('👔 Creando roles...');
  const administradorRole = await prisma.mom_rol.create({
    data: {
      codigo: 'ADMIN',
      nombre: 'Administrador',
      descripcion: 'Rol con todos los permisos del sistema',
      fecha_creacion_at: new Date(),
      created_at: new Date(),
      created_by: 1
    }
  });

  const supervisorRole = await prisma.mom_rol.create({
    data: {
      codigo: 'SUPER',
      nombre: 'Supervisor',
      descripcion: 'Rol de supervisor de campo',
      fecha_creacion_at: new Date(),
      created_at: new Date(),
      created_by: 1
    }
  });

  const trabajadorRole = await prisma.mom_rol.create({
    data: {
      codigo: 'TRABAJ',
      nombre: 'Trabajador',
      descripcion: 'Rol de trabajador agrícola',
      fecha_creacion_at: new Date(),
      created_at: new Date(),
      created_by: 1
    }
  });

  // Asignar permisos a roles
  console.log('🔗 Asignando permisos a roles...');
  const allPermisos = await prisma.mom_permiso.findMany();
  for (const permiso of allPermisos) {
    await prisma.rel_mom_rol__mom_permiso.create({
      data: {
        rol_id: administradorRole.rol_id,
        permiso_id: permiso.permiso_id,
        created_at: new Date(),
        created_by: 1
      }
    });
  }

  // Crear trabajadores
  console.log('👷 Creando trabajadores...');
  const trabajadores = await prisma.mom_trabajador.createMany({
    data: [
      {
        documento_identidad: '123456789',
        nombre_completo: 'Juan Pérez López',
        fecha_nacimiento: new Date('1985-05-15'),
        telefono: '+1234567890',
        email: 'juan.perez@empresa.com',
        fecha_registro_at: new Date(),
        created_at: new Date(),
        created_by: 1
      },
      {
        documento_identidad: '987654321',
        nombre_completo: 'María García Rodríguez',
        fecha_nacimiento: new Date('1990-08-22'),
        telefono: '+0987654321',
        email: 'maria.garcia@empresa.com',
        fecha_registro_at: new Date(),
        created_at: new Date(),
        created_by: 1
      },
      {
        documento_identidad: '456789123',
        nombre_completo: 'Carlos Martínez Sánchez',
        fecha_nacimiento: new Date('1988-12-10'),
        telefono: '+4567891230',
        email: 'carlos.martinez@empresa.com',
        fecha_registro_at: new Date(),
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear información laboral
  console.log('💼 Creando información laboral...');
  const trabajadoresList = await prisma.mom_trabajador.findMany();
  
  for (const trabajador of trabajadoresList) {
    await prisma.mot_info_laboral.create({
      data: {
        trabajador_id: trabajador.trabajador_id,
        cargo: 'Trabajador Agrícola',
        departamento: '',
        fecha_ingreso_at: new Date(),
        tipo_contrato: 'Indefinido',
        salario_base: 1200.00,
        fecha_ultima_actualizacion_at: new Date(),
        usuario_ultima_actualizacion: 1,
        created_at: new Date(),
        created_by: 1
      }
    });
  }

  // Crear usuarios
  console.log('👤 Creando usuarios...');
  const passwordHash = await bcrypt.hash('password123', 12);
  
  await prisma.mot_usuario.createMany({
    data: [
      {
        trabajador_id: trabajadoresList[0].trabajador_id,
        username: 'admin',
        password_hash: passwordHash,
        rol_id: administradorRole.rol_id,
        created_at: new Date(),
        created_by: 1
      },
      {
        trabajador_id: trabajadoresList[1].trabajador_id,
        username: 'supervisor',
        password_hash: passwordHash,
        rol_id: supervisorRole.rol_id,
        created_at: new Date(),
        created_by: 1
      },
      {
        trabajador_id: trabajadoresList[2].trabajador_id,
        username: 'trabajador',
        password_hash: passwordHash,
        rol_id: trabajadorRole.rol_id,
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear cultivos
  console.log('🌱 Creando cultivos...');
  const cultivos = await prisma.mom_cultivo.createMany({
    data: [
      {
        nombre: 'Maíz',
        descripcion: 'Cultivo de maíz amarillo',
        unidad_medida_principal: 'kilogramos',
        temporada_tipica: 'Primavera-Verano',
        created_at: new Date(),
        created_by: 1
      },
      {
        nombre: 'Frijol',
        descripcion: 'Cultivo de frijol negro',
        unidad_medida_principal: 'kilogramos',
        temporada_tipica: 'Verano-Otoño',
        created_at: new Date(),
        created_by: 1
      },
      {
        nombre: 'Tomate',
        descripcion: 'Cultivo de tomate cherry',
        unidad_medida_principal: 'kilogramos',
        temporada_tipica: 'Todo el año',
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear parcelas
  console.log('🏞️ Creando parcelas...');
  const parcelas = await prisma.mom_parcela.createMany({
    data: [
      {
        nombre: 'Parcela Norte',
        ubicacion_descripcion: 'Zona norte de la finca',
        area_hectareas: 5.5,
        tipo_terreno: 'Arcilloso',
        descripcion: 'Parcela principal para cultivos de temporada',
        created_at: new Date(),
        created_by: 1
      },
      {
        nombre: 'Parcela Sur',
        ubicacion_descripcion: 'Zona sur de la finca',
        area_hectareas: 3.2,
        tipo_terreno: 'Arenoso',
        descripcion: 'Parcela para cultivos especiales',
        created_at: new Date(),
        created_by: 1
      },
      {
        nombre: 'Parcela Este',
        ubicacion_descripcion: 'Zona este de la finca',
        area_hectareas: 4.8,
        tipo_terreno: 'Mixto',
        descripcion: 'Parcela para rotación de cultivos',
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear tareas
  console.log('📋 Creando tareas...');
  const cultivosList = await prisma.mom_cultivo.findMany();
  
  const tareas = await prisma.mom_tarea.createMany({
    data: [
      {
        cultivo_id: cultivosList[0].cultivo_id,
        nombre: 'Siembra de maíz',
        descripcion: 'Siembra manual de semillas de maíz',
        unidad_medicion: 'hectáreas',
        rendimiento_estandar: 0.5,
        instrucciones: 'Sembrar a 5cm de profundidad con 50cm de separación',
        niveles_dificultad: 'Media',
        created_at: new Date(),
        created_by: 1
      },
      {
        cultivo_id: cultivosList[1].cultivo_id,
        nombre: 'Cosecha de frijol',
        descripcion: 'Recolección manual de frijol',
        unidad_medicion: 'kilogramos',
        rendimiento_estandar: 20.0,
        instrucciones: 'Cosechar cuando las vainas estén secas',
        niveles_dificultad: 'Baja',
        created_at: new Date(),
        created_by: 1
      },
      {
        cultivo_id: cultivosList[2].cultivo_id,
        nombre: 'Riego de tomate',
        descripcion: 'Riego por goteo de plantas de tomate',
        unidad_medicion: 'plantas',
        rendimiento_estandar: 100.0,
        instrucciones: 'Regar cada 2 días por la mañana',
        niveles_dificultad: 'Baja',
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear esquemas de pago
  console.log('💰 Creando esquemas de pago...');
  const esquemasPago = await prisma.mom_esquema_pago.createMany({
    data: [
      {
        codigo: 'PAGO_HORA',
        nombre: 'Pago por Hora',
        tipo: 'hora',
        descripcion: 'Pago basado en horas trabajadas',
        fecha_creacion_at: new Date(),
        created_at: new Date(),
        created_by: 1
      },
      {
        codigo: 'PAGO_RENDIM',
        nombre: 'Pago por Rendimiento',
        tipo: 'rendimiento',
        descripcion: 'Pago basado en producción',
        fecha_creacion_at: new Date(),
        created_at: new Date(),
        created_by: 1
      },
      {
        codigo: 'PAGO_MIXTO',
        nombre: 'Pago Mixto',
        tipo: 'mixto',
        descripcion: 'Combinación de pago por hora y rendimiento',
        fecha_creacion_at: new Date(),
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear bonificaciones
  console.log('🎯 Creando bonificaciones...');
  const bonificaciones = await prisma.mom_bonificacion.createMany({
    data: [
      {
        codigo: 'BON_PUNTUAL',
        nombre: 'Bonificación por Puntualidad',
        descripcion: 'Bonificación por asistencia perfecta',
        tipo: 'fija',
        monto_fijo: 50.00,
        condiciones_aplicacion: 'Asistencia perfecta durante el mes',
        created_at: new Date(),
        created_by: 1
      },
      {
        codigo: 'BON_RENDIM',
        nombre: 'Bonificación por Alto Rendimiento',
        descripcion: 'Bonificación por superar metas de producción',
        tipo: 'porcentaje',
        porcentaje: 10.00,
        base_calculo: 'salario_base',
        condiciones_aplicacion: 'Rendimiento 20% superior al estándar',
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  // Crear cuadrillas
  console.log('👥 Creando cuadrillas...');
  const cuadrillas = await prisma.mom_cuadrilla.createMany({
    data: [
      {
        codigo_identificador: 'CUAD-001',
        nombre: 'Cuadrilla Alpha',
        descripcion: 'Cuadrilla principal de siembra',
        area_trabajo: 'Parcela Norte',
        fecha_creacion_at: new Date(),
        created_at: new Date(),
        created_by: 1
      },
      {
        codigo_identificador: 'CUAD-002',
        nombre: 'Cuadrilla Beta',
        descripcion: 'Cuadrilla de cosecha',
        area_trabajo: 'Parcela Sur',
        fecha_creacion_at: new Date(),
        created_at: new Date(),
        created_by: 1
      }
    ]
  });

  console.log('✅ Seeds completados exitosamente!');
  console.log('📊 Resumen:');
  console.log(`   - ${(await prisma.mom_trabajador.count())} trabajadores creados`);
  console.log(`   - ${(await prisma.mom_cultivo.count())} cultivos creados`);
  console.log(`   - ${(await prisma.mom_parcela.count())} parcelas creadas`);
  console.log(`   - ${(await prisma.mom_tarea.count())} tareas creadas`);
  console.log(`   - ${(await prisma.mot_usuario.count())} usuarios creados`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });