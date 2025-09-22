import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function DebugToken() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      try {
        // Auth0 SDK versions differ: newer versions expect `authorizationParams`.
        // Try the modern option first, then fallback to other shapes. Use `any` here
        // because this is a temporary debug helper.
  let token: string | undefined;
        try {
          const maybe = await getAccessTokenSilently({ authorizationParams: { audience: 'https://agromano-api.com' } } as any);
          token = (maybe && typeof maybe === 'string') ? maybe : (maybe as any)?.access_token || (maybe as any)?.token;
        } catch (e) {
          try {
            const maybe2 = await getAccessTokenSilently({ audience: 'https://agromano-api.com' } as any);
            token = (maybe2 && typeof maybe2 === 'string') ? maybe2 : (maybe2 as any)?.access_token || (maybe2 as any)?.token;
          } catch (e2) {
            // Final fallback: call without options (may return cached token)
            const maybe3 = await getAccessTokenSilently();
            token = (maybe3 && typeof maybe3 === 'string') ? maybe3 : (maybe3 as any)?.access_token || (maybe3 as any)?.token;
          }
        }

        console.log('DEBUG ACCESS TOKEN (cópialo):', token);
        // También podrías usar alert(token) si necesitas copiarlo desde UI.
      } catch (err) {
        console.error('Error obteniendo token:', err);
      }
    })();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
}
