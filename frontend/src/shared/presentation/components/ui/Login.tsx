import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Login as LoginIcon,
  Agriculture as AgricultureIcon
} from '@mui/icons-material';

const Login: React.FC = () => {
  const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();

  // Si ya está autenticado, no mostrar la página de login
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            maxWidth: 400,
            textAlign: 'center',
          }}
        >
          {/* Logo y título */}
          <Box sx={{ mb: 4 }}>
            <AgricultureIcon
              sx={{
                fontSize: 64,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              AgroMano
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Sistema de Gestión Agrícola
            </Typography>
          </Box>

          {/* Formulario de login */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                Ingrese con su cuenta autorizada para acceder al sistema
              </Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleLogin}
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {isLoading ? 'Conectando...' : 'Iniciar Sesión'}
              </Button>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="caption" color="textSecondary">
              Sistema seguro con autenticación Auth0
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            © 2024 AgroMano - Sistema de Gestión Agrícola
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
