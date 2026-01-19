import React, { useEffect } from "react";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { auth0Config } from "../config";
import { apiService } from "../../services/api.service";
import { MessageProvider } from "./MessageProvider";
import { ThemeToggleProvider } from "./ThemeToggleProvider";

// Componente para configurar el token provider
const ApiServiceConfig = () => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    // CONFIGURAR EL TOKEN PROVIDER AQUÍ
    apiService.setTokenProvider(getAccessTokenSilently);
    console.log("✅ ApiService configurado con token provider");
  }, [getAccessTokenSilently]);

  return null;
};

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
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
        <ThemeToggleProvider>
          <CssBaseline />
          <ApiServiceConfig />
          <MessageProvider>{children}</MessageProvider>
        </ThemeToggleProvider>
      </BrowserRouter>
    </Auth0Provider>
  );
};
