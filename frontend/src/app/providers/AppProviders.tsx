import React, {useEffect} from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { auth0Config, appConfig } from '../config';
import { apiService } from '../../services/api.service';
import { MessageProvider } from './MessageProvider';

// Tema personalizado de Material-UI
const theme = createTheme({
  palette: {
    primary: {
      main: appConfig.theme.primary,
    },
    secondary: {
      main: appConfig.theme.secondary,
    },
    background: {
      default: appConfig.theme.background,
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

// Componente para configurar el token provider
const ApiServiceConfig: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // ✅ CONFIGURAR EL TOKEN PROVIDER AQUÍ
    apiService.setTokenProvider(getAccessTokenSilently);
    console.log('✅ ApiService configurado con token provider');
  }, [getAccessTokenSilently]);

  return null;
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ApiServiceConfig />
          <MessageProvider>
            {children}
          </MessageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
};
