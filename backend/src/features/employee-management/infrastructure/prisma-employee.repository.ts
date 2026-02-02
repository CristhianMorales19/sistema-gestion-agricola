import { PrismaClient } from "@prisma/client";
import { EmployeeRepository } from "../domain/employee-repository";
import {
  CreateEmployee,
  Employee,
  EmployeeWithLabor,
  UpdateEmployee,
} from "../domain/employee";

export class PrismaEmployeeRepository implements EmployeeRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Employee[]> {
    const employees = await this.prisma.mom_trabajador.findMany({
      include: {
        mot_info_laboral: {
          select: {
            cargo: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return this.mapEmployees(employees);
  }

  async findById(id: number): Promise<EmployeeWithLabor | null> {
    const employee = await this.prisma.mom_trabajador.findUnique({
      where: { trabajador_id: id },
      include: { mot_info_laboral: true },
    });

    if (!employee) return null;

    const labor = employee.mot_info_laboral;

    return {
      employee: {
        id: employee.trabajador_id,
        identification: employee.documento_identidad,
        name: employee.nombre_completo,
        birthDate: employee.fecha_nacimiento,
        phone: employee.telefono ?? undefined,
        email: employee.email ?? undefined,
        hireDate: employee.fecha_registro_at,
        status: Boolean(employee.activo),
      },
      laborInfo: labor
        ? {
            position: labor.cargo,
            baseSalary: labor.salario_base?.toNumber() ?? null,
            contractType: labor.tipo_contrato,
            area: labor.area ?? undefined,
            payrollCode: labor.codigo_nomina ?? undefined,
            salaryGross: labor.salario_bruto?.toNumber(),
            ccssDeduction: labor.rebajas_ccss?.toNumber(),
            salaryPerHour: labor.salario_por_hora?.toNumber(),
            ordinaryHours: labor.horas_ordinarias?.toNumber(),
            otherDeductions: labor.otras_rebajas?.toNumber(),
            extraHours: labor.horas_extras?.toNumber(),
            otherHours: labor.horas_otras?.toNumber(),
            vacationAmount: labor.vacaciones_monto?.toNumber(),
            incapacityAmount: labor.incapacidad_monto?.toNumber(),
            lactationAmount: labor.lactancia_monto?.toNumber(),
          }
        : null,
    };
  }

  async existsByIdentification(identification: string): Promise<boolean> {
    const t = await this.prisma.mom_trabajador.findUnique({
      where: { documento_identidad: identification },
    });
    return t !== null;
  }

  async create(employee: CreateEmployee, userId: number): Promise<void> {
    await this.prisma.mom_trabajador.create({
      data: {
        documento_identidad: employee.identification,
        nombre_completo: employee.name,
        fecha_nacimiento: employee.birthDate,
        fecha_registro_at: employee.hireDate,
        telefono: employee.phone,
        email: employee.email,
        activo: employee.status,
        created_at: new Date(),
        created_by: userId,
      },
    });
  }

  async existsById(id: number): Promise<boolean> {
    const t = await this.prisma.mom_trabajador.findUnique({
      where: { trabajador_id: id },
    });
    return t !== null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.moh_trabajador_historial.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_asignacion_cuadrilla.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_asignacion_tarea.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_asistencia.deleteMany({ where: { trabajador_id: id } });
      await tx.mot_ausencia_justificada.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_deduccion_especial.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_info_laboral.deleteMany({ where: { trabajador_id: id } });
      await tx.mot_liquidacion.deleteMany({ where: { trabajador_id: id } });
      await tx.mot_registro_productividad.deleteMany({
        where: { trabajador_id: id },
      });
      await tx.mot_usuario.deleteMany({ where: { trabajador_id: id } });
      await tx.mom_trabajador.delete({
        where: { trabajador_id: id },
      });
    });
  }

  async search(query: string): Promise<Employee[]> {
    const employees = await this.prisma.mom_trabajador.findMany({
      where: {
        AND: [
          {
            OR: [
              { nombre_completo: { contains: query } },
              { documento_identidad: { contains: query } },
              {
                mot_info_laboral: {
                  is: { cargo: { contains: query } },
                },
              },
            ],
          },
        ],
      },
      include: {
        mot_info_laboral: {
          select: { cargo: true },
        },
      },
      orderBy: { created_at: "desc" },
      take: 50,
    });

    return this.mapEmployees(employees);
  }

  async findWithoutCrew(): Promise<Employee[]> {
    const employees = await this.prisma.mom_trabajador.findMany({
      where: {
        cuadrilla_id: null,
      },
      include: {
        mot_info_laboral: {
          select: {
            cargo: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return this.mapEmployees(employees);
  }

  async updateEmployee(
    id: number,
    data: UpdateEmployee,
    userId: number,
  ): Promise<void> {
    const existing = await this.prisma.mom_trabajador.findUnique({
      where: { trabajador_id: id },
      include: { mot_info_laboral: true },
    });

    await this.prisma.mom_trabajador.update({
      where: { trabajador_id: id },
      data: {
        documento_identidad: data.employee.identification,
        nombre_completo: data.employee.name,
        fecha_nacimiento: data.employee.birthDate,
        fecha_registro_at: data.employee.hireDate,
        telefono: data.employee.phone,
        email: data.employee.email,
        activo: data.employee.status,
        updated_at: new Date(),
        updated_by: userId,
      },
    });

    const labor = existing?.mot_info_laboral;

    const laborData = {
      trabajador_id: id,
      cargo: data.laborInfo.position,
      tipo_contrato: data.laborInfo.contractType,
      area: data.laborInfo.area,
      codigo_nomina: data.laborInfo.payrollCode,
      salario_base: data.laborInfo.baseSalary,
      salario_bruto: data.laborInfo.salaryGross,
      rebajas_ccss: data.laborInfo.ccssDeduction,
      otras_rebajas: data.laborInfo.otherDeductions,
      salario_por_hora: data.laborInfo.salaryPerHour,
      horas_ordinarias: data.laborInfo.ordinaryHours,
      horas_extras: data.laborInfo.extraHours,
      horas_otras: data.laborInfo.otherHours,
      vacaciones_monto: data.laborInfo.vacationAmount,
      incapacidad_monto: data.laborInfo.incapacityAmount,
      lactancia_monto: data.laborInfo.lactationAmount,
      usuario_ultima_actualizacion: userId,
      fecha_ultima_actualizacion_at: new Date(),
      fecha_ingreso_at: new Date(data.employee.hireDate),
    };

    if (!labor) {
      await this.prisma.mot_info_laboral.create({
        data: {
          ...laborData,
          created_by: userId,
          created_at: new Date(),
        },
      });
    } else {
      await this.prisma.mot_info_laboral.update({
        where: { info_laboral_id: labor.info_laboral_id },
        data: {
          ...laborData,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }
  }

  private mapEmployees(employees: any[]): Employee[] {
    return employees.map((t) => ({
      id: t.trabajador_id,
      name: t.nombre_completo,
      identification: t.documento_identidad,
      position: t.mot_info_laboral?.cargo ?? "Sin definir",
      hireDate: t.fecha_registro_at,
      birthDate: t.fecha_nacimiento,
      status: Boolean(t.activo),
      email: t.email ?? undefined,
      phone: t.telefono ?? undefined,
    }));
  }
}
