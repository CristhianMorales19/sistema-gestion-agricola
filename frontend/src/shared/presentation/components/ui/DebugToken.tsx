import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function DebugToken() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      try {
        // Auth0 SDK versions differ: newer versions expect `authorizationParams`.
        // Try the modern option first, then fallback to other shapes.
        let token: string | undefined;
        try {
          const maybe = await getAccessTokenSilently({ 
            authorizationParams: { audience: 'https://agromano-api.com' } 
          } as { authorizationParams: { audience: string } });
          
          if (typeof maybe === 'string') {
            token = maybe;
          } else if (typeof maybe === 'object' && maybe !== null) {
            const maybeObj = maybe as Record<string, unknown>;
            token = (typeof maybeObj.access_token === 'string' ? maybeObj.access_token : undefined) || 
                    (typeof maybeObj.token === 'string' ? maybeObj.token : undefined);
          }
        } catch (e) {
          try {
            const maybe2 = await getAccessTokenSilently();
            
            if (typeof maybe2 === 'string') {
              token = maybe2;
            } else if (typeof maybe2 === 'object' && maybe2 !== null) {
              const maybe2Obj = maybe2 as Record<string, unknown>;
              token = (typeof maybe2Obj.access_token === 'string' ? maybe2Obj.access_token : undefined) || 
                      (typeof maybe2Obj.token === 'string' ? maybe2Obj.token : undefined);
            }
          } catch (e2) {
            // Final fallback: call without options (may return cached token)
            const maybe3 = await getAccessTokenSilently();
            if (typeof maybe3 === 'string') {
              token = maybe3;
            } else if (typeof maybe3 === 'object' && maybe3 !== null) {
              const maybe3Obj = maybe3 as Record<string, unknown>;
              token = (typeof maybe3Obj.access_token === 'string' ? maybe3Obj.access_token : undefined) || 
                      (typeof maybe3Obj.token === 'string' ? maybe3Obj.token : undefined);
            }
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
