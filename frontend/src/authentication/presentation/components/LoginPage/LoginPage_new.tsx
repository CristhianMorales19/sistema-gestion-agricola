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
                  backgroundColor: '#1e40af',
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
                AgroManager
              </Typography>
              <Typography
                variant="h6"
                sx={{ 
                  color: '#64748b',
                  mb: 1
                }}
              >
                Sistema de Gestión Agrícola
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: '#64748b'
                }}
              >
                Inicia sesión para acceder al sistema
              </Typography>
            </Box>

            {/* Información del Sistema */}
            <Box sx={{ mb: 4 }}>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  '& .MuiAlert-message': {
                    fontSize: '0.875rem'
                  }
                }}
              >
                Este sistema utiliza Auth0 para autenticación segura. Los roles y permisos se gestionan desde la base de datos del sistema.
              </Alert>
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
                backgroundColor: '#1e40af',
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                },
                '&:disabled': {
                  backgroundColor: '#9ca3af'
                }
              }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión con Auth0'}
            </Button>

            {/* Error */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {/* Información adicional */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                💼 <strong>Para Administradores:</strong> Una vez autenticado, tendrás acceso completo al dashboard y configuración del sistema.
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                🛡️ <strong>Seguridad:</strong> Autenticación OAuth 2.0 + JWT
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                📊 <strong>RBAC:</strong> Control de acceso basado en roles
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
