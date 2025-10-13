import { ApiAbsenceRepository } from '../ApiAbsenceRepository';
import { Absence } from '../../domain/entities/Absence';
import { apiService } from '../../../services/api.service';

// Mock de apiService
jest.mock('../../../services/api.service', () => ({
  apiService: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = apiService as jest.Mocked<typeof apiService>;

describe('ApiAbsenceRepository', () => {
  let repository: ApiAbsenceRepository;

  beforeEach(() => {
    repository = new ApiAbsenceRepository();
    jest.clearAllMocks();
  });

  it('debe obtener todas las ausencias', async () => {
    const fakeAbsences: Absence[] = [
      { 
        id: '1',
        trabajador_id: 't1',
        trabajador_nombre: 'Juan',
        trabajador_documento: '123',
        fecha_ausencia: '2025-10-12',
        motivo: 'enfermedad',
        estado: 'pendiente',
        fecha_registro: '2025-10-12',
      }
    ];

    mockedApi.get.mockResolvedValueOnce({ data: { ausencias: fakeAbsences } });

    const result = await repository.getAll();
    expect(result).toEqual(fakeAbsences);
    expect(mockedApi.get).toHaveBeenCalledWith('/ausencias');
  });

  it('debe crear una nueva ausencia', async () => {
    const newAbsence: Absence = {
      id: '2',
      trabajador_id: 't2',
      trabajador_nombre: 'Ana',
      trabajador_documento: '456',
      fecha_ausencia: '2025-10-13',
      motivo: 'cita_medica',
      estado: 'pendiente',
      fecha_registro: '2025-10-13',
    };

    mockedApi.post.mockResolvedValueOnce({ data: { ausencia: newAbsence } });

    const result = await repository.create({
      trabajador_id: 't2',
      fecha_ausencia: '2025-10-13',
      motivo: 'cita_medica',
    });

    expect(result).toEqual(newAbsence);
    expect(mockedApi.post).toHaveBeenCalledWith('/ausencias', {
      trabajador_id: 't2',
      fecha_ausencia: '2025-10-13',
      motivo: 'cita_medica',
    });
  });
});
