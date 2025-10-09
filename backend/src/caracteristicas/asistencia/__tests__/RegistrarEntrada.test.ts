// NOTA: Test simplificado para compatibilidad de parser; se evita sintaxis TS avanzada
import { RegistrarEntrada } from '../application/RegistrarEntrada';
import { Asistencia } from '../domain/Asistencia';

function crearRepoMock() {
  const registros = [];
  return {
    async registrarEntrada(data) {
      const nuevo = Asistencia.crear({
        id: registros.length + 1,
        trabajadorId: data.trabajadorId,
        fecha: data.fecha,
        horaEntrada: data.horaEntrada,
        ubicacion: data.ubicacion,
        creadoEn: data.creadoEn,
      });
      registros.push(nuevo);
      return nuevo;
    },
    async existeEntradaHoy(trabajadorId, fechaISO) {
      return registros.some(r => r.trabajadorId === trabajadorId && r.fecha === fechaISO);
    }
  };
}

describe('RegistrarEntrada UseCase', () => {
  it('registra una nueva entrada cuando no existe duplicado', async () => {
  const repo = crearRepoMock();
    const uc = new RegistrarEntrada(repo);
    const res = await uc.execute({ trabajadorId: 10 });
    expect(res.trabajadorId).toBe(10);
    expect(res.horaEntrada).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it('lanza error si ya existe una entrada hoy', async () => {
  const repo = crearRepoMock();
    const uc = new RegistrarEntrada(repo);
    const fecha = '2025-10-08';
    await uc.execute({ trabajadorId: 5, fecha });
    await expect(uc.execute({ trabajadorId: 5, fecha })).rejects.toThrow('Ya existe una entrada');
  });

  it('usa hora proporcionada si se pasa manualmente', async () => {
  const repo = crearRepoMock();
    const uc = new RegistrarEntrada(repo);
    const res = await uc.execute({ trabajadorId: 3, horaEntrada: '07:30:00' });
    expect(res.horaEntrada).toBe('07:30:00');
  });
});
