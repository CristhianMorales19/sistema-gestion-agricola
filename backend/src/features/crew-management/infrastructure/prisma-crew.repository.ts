import { PrismaClient } from "@prisma/client";
import { CrewRepository } from "../domain/crew-repository";
import { CreateCrew, Crew, UpdateCrew } from "../domain/crew";

export class PrimaCrewRepository implements CrewRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Crew[]> {
    const crews = await this.prisma.mom_cuadrilla.findMany({
      include: {
        mom_trabajador: {
          select: {
            trabajador_id: true,
            nombre_completo: true,
            documento_identidad: true,
            fecha_nacimiento: true,
            fecha_registro_at: true,
            activo: true,
            email: true,
            telefono: true,
            mot_info_laboral: {
              select: {
                cargo: true,
              },
            },
          },
        },
      },
      orderBy: { fecha_creacion_at: "desc" },
    });

    return this.mapCrews(crews);
  }

  async existsByCode(code: string): Promise<boolean> {
    const c = await this.prisma.mom_cuadrilla.findUnique({
      where: {
        codigo_identificador: code,
      },
    });
    return c !== null;
  }

  async workersExist(ids: number[]): Promise<number[]> {
    const rows = await this.prisma.mom_trabajador.findMany({
      where: { trabajador_id: { in: ids } },
      select: { trabajador_id: true },
    });

    return rows.map((r) => r.trabajador_id);
  }

  async create(data: CreateCrew, userId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const crew = await tx.mom_cuadrilla.create({
        data: {
          codigo_identificador: data.code,
          nombre: "",
          descripcion: data.description,
          area_trabajo: data.workArea,
          activa: true,
          fecha_creacion_at: new Date(),
          created_at: new Date(),
          created_by: userId,
        },
      });

      if (data.workers?.length) {
        await tx.mot_asignacion_cuadrilla.createMany({
          data: data.workers.map((id: number) => ({
            cuadrilla_id: crew.cuadrilla_id,
            trabajador_id: id,
            fecha_asignacion_at: new Date(),
            usuario_asignacion: userId,
            activa: true,
            created_at: new Date(),
            created_by: userId,
          })),
        });

        await tx.mom_trabajador.updateMany({
          where: {
            trabajador_id: { in: data.workers },
          },
          data: {
            cuadrilla_id: crew.cuadrilla_id,
          },
        });
      }
    });
  }

  async existsById(crewId: number): Promise<boolean> {
    const exists = await this.prisma.mom_cuadrilla.findUnique({
      where: { cuadrilla_id: crewId },
    });
    return exists !== null;
  }

  async update(
    data: UpdateCrew,
    userId: number,
    crewId: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Actualizamos la cuadrilla.
      await tx.mom_cuadrilla.update({
        where: { cuadrilla_id: crewId },
        data: {
          ...(data.code !== undefined && { codigo_identificador: data.code }),
          ...(data.description !== undefined && {
            descripcion: data.description,
          }),
          ...(data.workArea !== undefined && { area_trabajo: data.workArea }),
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      if (data.workers) {
        // 2. Buscamos los empleados que estan en esa cuadrilla
        const oldWorkers = await tx.mom_trabajador.findMany({
          where: { cuadrilla_id: crewId },
          select: { trabajador_id: true },
        });

        const oldWorkersIds = oldWorkers.map((o) => o.trabajador_id);

        // 3. Si los antiguos empleados no aparecen en los nuevos empleados asignados
        // desactivamos la relacion
        const deleteWorkers = oldWorkersIds.filter(
          (w) => !data.workers?.includes(w),
        );
        if (deleteWorkers.length > 0) {
          await tx.mot_asignacion_cuadrilla.updateMany({
            where: {
              AND: [
                {
                  trabajador_id: { in: deleteWorkers },
                  cuadrilla_id: crewId,
                },
              ],
            },
            data: {
              activa: false,
              usuario_retiro: userId,
              fecha_retiro_at: new Date(),
            },
          });

          // 4. A los viejos empleados que no aparecen le eliminamos su relacion con la cuadrilla
          await tx.mom_trabajador.updateMany({
            where: {
              trabajador_id: { in: deleteWorkers },
            },
            data: { cuadrilla_id: null },
          });
        }

        // 5. Filtramos solamente a los nuevos trabajadores (no se crea un nuevo dato para los que ya estan)
        // y creamos el registro

        const newWorkers = data.workers.filter(
          (w) => !oldWorkersIds.includes(w),
        );

        if (newWorkers.length > 0) {
          // crear nuevas asignaciones
          await tx.mot_asignacion_cuadrilla.createMany({
            data: newWorkers.map((workerId) => ({
              cuadrilla_id: crewId,
              trabajador_id: workerId,
              fecha_asignacion_at: new Date(),
              usuario_asignacion: userId,
              activa: true,
              created_at: new Date(),
              created_by: userId,
            })),
          });
        }

        // 6. Actualizamos a los nuevos trabajadores con su nueva cuadrilla
        await tx.mom_trabajador.updateMany({
          where: {
            trabajador_id: { in: data.workers },
          },
          data: {
            cuadrilla_id: crewId,
          },
        });
      }
    });
  }

  async delete(crewId: number, userId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.mom_trabajador.updateMany({
        where: { cuadrilla_id: crewId },
        data: {
          cuadrilla_id: null,
        },
      });

      await tx.mot_asignacion_cuadrilla.updateMany({
        where: {
          cuadrilla_id: crewId,
          activa: true,
        },
        data: {
          activa: false,
          usuario_retiro: userId,
          fecha_retiro_at: new Date(),
        },
      });

      await tx.mom_cuadrilla.delete({
        where: { cuadrilla_id: crewId },
      });
    });
  }

  async search(query: string): Promise<Crew[]> {
    const crews = await this.prisma.mom_cuadrilla.findMany({
      where: {
        OR: [
          { codigo_identificador: { contains: query.toLowerCase() } },
          { area_trabajo: { contains: query.toLowerCase() } },
        ],
      },
      include: {
        mom_trabajador: {
          select: {
            trabajador_id: true,
            nombre_completo: true,
            documento_identidad: true,
            fecha_nacimiento: true,
            fecha_registro_at: true,
            activo: true,
            email: true,
            telefono: true,
            mot_info_laboral: {
              select: {
                cargo: true,
              },
            },
          },
        },
      },
      orderBy: { fecha_creacion_at: "desc" },
      take: 50, // Limitar resultados
    });

    return this.mapCrews(crews);
  }

  private mapCrews(crews: any[]): Crew[] {
    return crews.map((c) => ({
      id: c.cuadrilla_id,
      code: c.codigo_identificador,
      description: c.descripcion ?? undefined,
      workArea: c.area_trabajo ?? undefined,
      active: c.activa,
      workers: c.mom_trabajador.map((t: any) => ({
        id: t.trabajador_id,
        name: t.nombre_completo,
        identification: t.documento_identidad,
        position: t.mot_info_laboral?.cargo ?? "Sin definir",
        hireDate: t.fecha_registro_at,
        birthDate: t.fecha_nacimiento,
        email: t.email ?? undefined,
        phone: t.telefono ?? undefined,
        status: Boolean(t.activo),
      })),
    }));
  }
}
