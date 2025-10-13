import { AbsenceUseCases } from '../AbsenceUseCases';
import { AbsenceRepository } from '../../repositories/AbsenceRepository';

const mockRepo: jest.Mocked<AbsenceRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  getByEmployeeId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  approve: jest.fn(),
  reject: jest.fn(),
  getStats: jest.fn(),
  existsForDate: jest.fn(),
  uploadDocument: jest.fn()
};

describe('AbsenceUseCases', () => {
  let useCases: AbsenceUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    useCases = new AbsenceUseCases(mockRepo);
  });

  it('lanza error si falta el id del trabajador', async () => {
    await expect(useCases.registerAbsence({
      trabajador_id: '',
      fecha_ausencia: '2025-01-01',
      motivo: 'enfermedad'
    })).rejects.toThrow('El ID del trabajador es requerido');
  });

  it('crea una ausencia válida', async () => {
    mockRepo.existsForDate.mockResolvedValue(false);
    mockRepo.create.mockResolvedValue({ id: '1', trabajador_id: 'T1', fecha_ausencia: '2025-01-01', motivo: 'enfermedad', estado: 'pendiente', trabajador_nombre: 'Juan', trabajador_documento: '123', fecha_registro: '2025-01-01' });

    const result = await useCases.registerAbsence({
      trabajador_id: 'T1',
      fecha_ausencia: '2025-01-01',
      motivo: 'enfermedad'
    });

    expect(result.id).toBe('1');
    expect(mockRepo.create).toHaveBeenCalled();
  });

  it('lanza error si ya existe una ausencia para esa fecha', async () => {
    mockRepo.existsForDate.mockResolvedValue(true);
    await expect(useCases.registerAbsence({
      trabajador_id: 'T1',
      fecha_ausencia: '2025-01-01',
      motivo: 'enfermedad'
    })).rejects.toThrow('Ya existe un registro de ausencia para esta fecha y trabajador');
  });
});
