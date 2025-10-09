import React, { useState } from 'react';
import { Button } from '@mui/material';
import { secondaryButtonSx } from '../theme/asistenciaStyles';

interface GeolocationButtonProps {
  onLocation: (lat: number, lng: number, formatted: string) => void;
}

export const GeolocationButton: React.FC<GeolocationButtonProps> = ({ onLocation }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const formatted = `geo:${latitude.toFixed(6)},${longitude.toFixed(6)}`;
      onLocation(latitude, longitude, formatted);
      setLoading(false);
    }, err => {
      console.warn('[GeolocationButton] error', err);
      setLoading(false);
      alert('No se pudo obtener ubicación');
    }, { enableHighAccuracy: true, timeout: 5000 });
  };

  return (
    <Button
      variant="contained"
      size="small"
      onClick={handleClick}
      disabled={loading}
      sx={{ whiteSpace: 'nowrap', ...secondaryButtonSx, px: 2, minWidth: 0 }}
    >{loading ? '...' : 'GPS'}</Button>
  );
};

export default GeolocationButton;
