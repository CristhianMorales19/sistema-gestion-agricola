import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeds de la base de datos...');

  // Crear departamentos
  console.log('📁 Creando departamentos...');
  const departamentos = await Promise.all([
    prisma.departamento.create({
      data: {
        nombre: 'Administración',
        descripcion: 'Departamento administrativo y gerencial'
      }
    }),
    prisma.departamento.create({
      data: {
        nombre: 'Producción',
        descripcion: 'Departamento de producción agrícola'
      }
    }),
    prisma.departamento.create({
      data: {
        nombre: 'Mantenimiento',
        descripcion: 'Departamento de mantenimiento y equipos'
      }
    }),
    prisma.departamento.create({
      data: {
        nombre: 'Recursos Humanos',
        descripcion: 'Departamento de gestión humana'
      }
    })
  ]);

  // Crear cargos
  console.log('💼 Creando cargos...');
  const cargos = await Promise.all([
    prisma.cargo.create({
      data: {
        nombre: 'Gerente General',
        descripcion: 'Máximo responsable de la empresa',
        salarioBase: 5000000
      }
    }),
    prisma.cargo.create({
      data: {
        nombre: 'Supervisor',
        descripcion: 'Supervisor de área',
        salarioBase: 2500000
      }
    }),
    prisma.cargo.create({
      data: {
        nombre: 'Operario Agrícola',
        descripcion: 'Trabajador de campo',
        salarioBase: 1200000
      }
    }),
    prisma.cargo.create({
      data: {
        nombre: 'Técnico Mantenimiento',
        descripcion: 'Técnico en mantenimiento de equipos',
        salarioBase: 1800000
      }
    }),
    prisma.cargo.create({
      data: {
        nombre: 'Asistente Administrativo',
        descripcion: 'Apoyo administrativo',
        salarioBase: 1300000
      }
    })
  ]);

  // Crear usuario administrador
  console.log('👤 Creando usuario administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.usuario.create({
    data: {
      email: 'admin@gestionagricola.com',
      password: hashedPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      rol: 'ADMIN'
    }
  });

  // Crear empleado administrador
  console.log('👨‍💼 Creando empleado administrador...');
  const adminEmpleado = await prisma.empleado.create({
    data: {
      cedula: '12345678',
      nombre: 'Administrador',
      apellido: 'Sistema',
      email: 'admin@gestionagricola.com',
      telefono: '300-123-4567',
      direccion: 'Calle Principal #123',
      fechaIngreso: new Date(),
      salarioBase: 5000000,
      cargoId: cargos[0].id, // Gerente General
      departamentoId: departamentos[0].id, // Administración
      usuarioId: adminUser.id
    }
  });

  // Crear empleados de ejemplo
  console.log('👥 Creando empleados de ejemplo...');
  
  // Supervisor
  const supervisorUser = await prisma.usuario.create({
    data: {
      email: 'supervisor@gestionagricola.com',
      password: await bcrypt.hash('supervisor123', 12),
      nombre: 'Juan Carlos',
      apellido: 'Supervisor',
      rol: 'SUPERVISOR'
    }
  });

  const supervisorEmpleado = await prisma.empleado.create({
    data: {
      cedula: '87654321',
      nombre: 'Juan Carlos',
      apellido: 'Supervisor',
      email: 'supervisor@gestionagricola.com',
      telefono: '300-987-6543',
      direccion: 'Carrera 50 #25-30',
      fechaNacimiento: new Date('1985-03-15'),
      fechaIngreso: new Date('2020-01-15'),
      salarioBase: 2500000,
      cargoId: cargos[1].id, // Supervisor
      departamentoId: departamentos[1].id, // Producción
      usuarioId: supervisorUser.id
    }
  });

  // Operarios
  const operarios = await Promise.all([
    prisma.empleado.create({
      data: {
        cedula: '11111111',
        nombre: 'María',
        apellido: 'González',
        email: 'maria.gonzalez@gestionagricola.com',
        telefono: '300-111-1111',
        direccion: 'Barrio Los Rosales #45-12',
        fechaNacimiento: new Date('1992-07-22'),
        fechaIngreso: new Date('2021-03-01'),
        salarioBase: 1200000,
        cargoId: cargos[2].id, // Operario Agrícola
        departamentoId: departamentos[1].id // Producción
      }
    }),
    prisma.empleado.create({
      data: {
        cedula: '22222222',
        nombre: 'Pedro',
        apellido: 'Martínez',
        email: 'pedro.martinez@gestionagricola.com',
        telefono: '300-222-2222',
        direccion: 'Vereda La Esperanza Km 5',
        fechaNacimiento: new Date('1988-11-10'),
        fechaIngreso: new Date('2020-08-15'),
        salarioBase: 1200000,
        cargoId: cargos[2].id, // Operario Agrícola
        departamentoId: departamentos[1].id // Producción
      }
    }),
    prisma.empleado.create({
      data: {
        cedula: '33333333',
        nombre: 'Ana',
        apellido: 'López',
        email: 'ana.lopez@gestionagricola.com',
        telefono: '300-333-3333',
        direccion: 'Centro #123-45',
        fechaNacimiento: new Date('1995-05-18'),
        fechaIngreso: new Date('2022-01-10'),
        salarioBase: 1300000,
        cargoId: cargos[4].id, // Asistente Administrativo
        departamentoId: departamentos[0].id // Administración
      }
    })
  ]);

  // Crear registros de asistencia de ejemplo (últimos 7 días)
  console.log('⏰ Creando registros de asistencia...');
  const empleadosIds = [adminEmpleado.id, supervisorEmpleado.id, ...operarios.map(o => o.id)];
  
  for (let i = 6; i >= 0; i--) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - i);
    
    for (const empleadoId of empleadosIds) {
      // Simular asistencia normal (80% de probabilidad)
      if (Math.random() > 0.2) {
        const horaEntrada = new Date(fecha);
        horaEntrada.setHours(7 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)); // 7:00-8:59
        
        const horaSalida = new Date(fecha);
        horaSalida.setHours(16 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)); // 16:00-17:59
        
        const horasRegulares = (horaSalida.getTime() - horaEntrada.getTime()) / (1000 * 60 * 60);
        const horasExtras = horasRegulares > 8 ? horasRegulares - 8 : 0;
        
        await prisma.registroAsistencia.create({
          data: {
            empleadoId,
            fecha,
            horaEntrada,
            horaSalida,
            horasRegulares: Math.min(horasRegulares, 8),
            horasExtras,
            estado: horaEntrada.getHours() > 8 ? 'TARDANZA' : 'PRESENTE'
          }
        });
      }
    }
  }

  // Crear metas de ejemplo
  console.log('🎯 Creando metas de ejemplo...');
  for (const empleadoId of empleadosIds.slice(1)) { // Excluir admin
    await prisma.meta.create({
      data: {
        empleadoId,
        titulo: 'Productividad Mensual',
        descripcion: 'Alcanzar meta de productividad del mes',
        fechaInicio: new Date(),
        fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        valorObjetivo: 100,
        valorActual: Math.floor(Math.random() * 80),
        unidadMedida: 'porcentaje'
      }
    });
  }

  console.log('✅ Seeds completados exitosamente!');
  console.log('📧 Usuario admin: admin@gestionagricola.com');
  console.log('🔑 Contraseña: admin123');
  console.log('📧 Usuario supervisor: supervisor@gestionagricola.com');
  console.log('🔑 Contraseña: supervisor123');
}

main()
  .catch((e) => {
    console.error('❌ Error en seeds:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
