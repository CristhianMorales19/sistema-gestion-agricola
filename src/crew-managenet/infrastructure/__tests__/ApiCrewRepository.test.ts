import { ApiCrewRepository } from '../ApiCrewRepository';
import { apiService } from '../../../services/api.service';
import { CrewApiResponse } from '../../domain/entities/Crew';

jest.mock('../../../services/api.service');

const mockedApi = apiService as jest.Mocked<typeof apiService>;

describe('ApiCrewRepository', () => {
  let repository: ApiCrewRepository;

  const mockCrew: CrewApiResponse = {
    id: '1',
    code: 'C001',
    description: 'Cuadrilla de prueba',
    workArea: 'Area 1',
    active: true,
    workers: [
      { id: 'w1', name: 'Juan', identification: '123' },
      { id: 'w2', name: 'Maria', identification: '456' }
    ]
  };

  beforeEach(() => {
    repository = new ApiCrewRepository();
    jest.clearAllMocks();
  });

  it('getAllCrews devuelve cuadrillas correctamente', async () => {
    mockedApi.get.mockResolvedValueOnce({ success: true, data: [mockCrew] });

    const crews = await repository.getAllCrews();

    expect(mockedApi.get).toHaveBeenCalledWith('/cuadrillas');
    expect(crews).toHaveLength(1);
    expect(crews[0].code).toBe('C001');
    expect(crews[0].workers).toHaveLength(2);
  });

  it('getCrewByCodeOrArea busca cuadrilla correctamente', async () => {
    mockedApi.get.mockResolvedValueOnce({ success: true, data: [mockCrew] });

    const crews = await repository.getCrewByCodeOrArea('C001');

    expect(mockedApi.get).toHaveBeenCalledWith('/cuadrillas/C001');
    expect(crews[0].workArea).toBe('Area 1');
  });

  it('lanza error si response.success es false', async () => {
    mockedApi.get.mockResolvedValueOnce({ success: false, data: [] });

    await expect(repository.getAllCrews()).rejects.toThrow('Failed to fetch crews');
  });
});
