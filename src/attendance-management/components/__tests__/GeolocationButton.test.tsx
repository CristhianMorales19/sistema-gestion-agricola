// src/features/asistencia/__tests__/GeolocationButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import GeolocationButton from '../GeolocationButton';

describe('GeolocationButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el texto GPS inicialmente', () => {
    render(<GeolocationButton onLocation={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveTextContent('GPS');
  });

  it('llama a onLocation con coordenadas', async () => {
    const mockGetCurrentPosition = jest.fn().mockImplementation((success) =>
      success({ coords: { latitude: 10, longitude: 20 } })
    );
    // @ts-ignore
    global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };

    const handleLocation = jest.fn();
    render(<GeolocationButton onLocation={handleLocation} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockGetCurrentPosition).toHaveBeenCalled();
    // Esperar que se llame onLocation
    setTimeout(() => {
      expect(handleLocation).toHaveBeenCalledWith(10, 20, 'geo:10.000000,20.000000');
    }, 0);
  });

  it('maneja error de geolocalización', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const mockGetCurrentPosition = jest.fn().mockImplementation((_success, error) => error({ code: 1 }));
    // @ts-ignore
    global.navigator.geolocation = { getCurrentPosition: mockGetCurrentPosition };

    render(<GeolocationButton onLocation={jest.fn()} />);
    fireEvent.click(screen.getByRole('button'));
    expect(alertMock).toHaveBeenCalledWith('No se pudo obtener ubicación');
  });
});