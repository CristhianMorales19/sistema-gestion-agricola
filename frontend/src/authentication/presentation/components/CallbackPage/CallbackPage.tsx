import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

export const CallbackPage: React.FC = () => {
  const { isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Una vez que Auth0 termine de procesar, redirigir al dashboard
    if (!isLoading && !error) {
      navigate('/dashboard');
    }
  }, [isLoading, error, navigate]);

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error de Autenticación
        </Typography>
        <Typography variant="body2">
          {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '50vh',
      gap: 2 
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" gutterBottom>
        Procesando autenticación...
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Configurando tu sesión segura
      </Typography>
    </Box>
  );
};
