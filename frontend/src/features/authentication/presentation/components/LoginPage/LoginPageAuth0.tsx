import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Security,
  Agriculture,
  Login as LoginIcon
} from '@mui/icons-material';
import { useAuth } from '../../../application/hooks/useAuth';

// Componente principal de la página de login
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
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: 6 }}>
            {/* Logo y Título */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  backgroundColor: '#1e40af',
                  borderRadius: 3,
                  p: 2,
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
                  mb: 1
                }}
              >
                AgroManager
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: '#64748b', mb: 4 }}
              >
                Sistema de Gestión Agrícola Empresarial
              </Typography>

              {/* Información de seguridad */}
              <Paper
                sx={{
                  backgroundColor: '#f1f5f9',
                  p: 2,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  mb: 4
                }}
              >
                <Security sx={{ color: '#1e40af', fontSize: 16 }} />
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Autenticación segura con Auth0
                </Typography>
              </Paper>
            </Box>

            {/* Botón de Login */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleLogin}
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{
                  backgroundColor: '#1e40af',
                  color: '#ffffff',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1e3a8a'
                  },
                  '&:disabled': {
                    backgroundColor: '#94a3b8'
                  }
                }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión con Auth0'}
              </Button>

              {/* Mensaje de error */}
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mt: 3, borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}

              {/* Información adicional */}
              <Typography
                variant="body2"
                sx={{ 
                  color: '#94a3b8', 
                  mt: 4,
                  lineHeight: 1.6 
                }}
              >
                Serás redirigido a Auth0 para autenticarte de forma segura.
                <br />
                El sistema asignará automáticamente tus permisos según tu rol.
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Footer con información del sistema */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © 2025 AgroManager - Sistema de Gestión Agrícola con RBAC
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
