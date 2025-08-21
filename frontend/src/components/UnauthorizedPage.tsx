import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { Block, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card elevation={3} sx={{ width: '100%', maxWidth: 500, textAlign: 'center', p: 2 }}>
          <CardContent>
            <Block sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            
            <Typography variant="h4" component="h1" gutterBottom>
              Acceso Denegado
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No tienes permisos suficientes para acceder a esta página.
            </Typography>

            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              size="large"
            >
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};