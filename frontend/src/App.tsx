import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Card, CardContent } from '@mui/material';

// Crear tema de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Verde para tema agrícola
    },
    secondary: {
      main: '#ff8f00', // Naranja
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom color="primary">
              Sistema Gestión Agrícola
            </Typography>
            <Typography variant="body1">
              ✅ Frontend básico funcionando!
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Backend API ejecutándose en: http://localhost:3001
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default App;