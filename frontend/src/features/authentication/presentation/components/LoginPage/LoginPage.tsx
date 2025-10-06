import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import {
  Agriculture,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../../application/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Error en login:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
            p: 4
          }}
        >
          <CardContent>
            {/* Logo y Título */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  backgroundColor: '#16a34a',
                  borderRadius: 3,
                  p: 3,
                  display: 'inline-block',
                  mb: 3
                }}
              >
                <Agriculture sx={{ fontSize: 40, color: '#ffffff' }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1e293b',
                  mb: 2
                }}
              >
                AgroMano
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: '#64748b',
                  mb: 1
                }}
              >
                Sistema de Gestión Agrícola Empresarial
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: '#64748b'
                }}
              >
                Acceso seguro para personal autorizado
              </Typography>
            </Box>

            {/* Botón de Login */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              disabled={isLoading}
              sx={{
                backgroundColor: '#16a34a',
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: '#15803d',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af'
                }
              }}
            >
              {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
            </Button>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                Error de autenticación. Verifique sus credenciales.
              </Alert>
            )}

            {/* Footer profesional */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Autenticación segura • Control de acceso empresarial
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
