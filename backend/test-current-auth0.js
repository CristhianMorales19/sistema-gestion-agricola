const axios = require('axios');
require('dotenv').config();

async function testWithCurrentScopes() {
    console.log('🔐 Probando con permisos actuales de Auth0...\n');

    const config = {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE
    };

    try {
        // Primero probemos sin audience para ver si funciona
        console.log('🚀 Intentando obtener token sin audience...');
        const tokenResponse = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: 'client_credentials'
        });

        console.log('✅ Token obtenido sin audience!');
        console.log(`   Scopes: ${tokenResponse.data.scope || 'Ninguno'}`);
        
        const token = tokenResponse.data.access_token;
        
        // Decodificar el token para ver su contenido
        const parts = token.split('.');
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        
        console.log('\n🔍 Contenido del token:');
        console.log(`   Issuer: ${payload.iss}`);
        console.log(`   Audience: ${payload.aud}`);
        console.log(`   Subject: ${payload.sub}`);
        console.log(`   Scopes: ${payload.scope || 'Ninguno'}`);
        console.log(`   Expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
        
        return token;
        
    } catch (error1) {
        console.log('❌ Error sin audience:', error1.response?.data || error1.message);
        
        // Si falla sin audience, probemos con audience
        try {
            console.log('\n🚀 Intentando obtener token con audience...');
            const tokenResponse = await axios.post(`https://${config.domain}/oauth/token`, {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                audience: config.audience,
                grant_type: 'client_credentials'
            });

            console.log('✅ Token obtenido con audience!');
            console.log(`   Scopes: ${tokenResponse.data.scope || 'Ninguno'}`);
            
            const token = tokenResponse.data.access_token;
            
            // Decodificar el token
            const parts = token.split('.');
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            
            console.log('\n🔍 Contenido del token:');
            console.log(`   Issuer: ${payload.iss}`);
            console.log(`   Audience: ${payload.aud}`);
            console.log(`   Subject: ${payload.sub}`);
            console.log(`   Scopes: ${payload.scope || 'Ninguno'}`);
            console.log(`   Permissions: ${payload.permissions ? payload.permissions.join(', ') : 'Ninguno'}`);
            console.log(`   Expires: ${new Date(payload.exp * 1000).toLocaleString()}`);
            
            return token;
            
        } catch (error2) {
            console.log('❌ Error con audience:', error2.response?.data || error2.message);
            
            console.log('\n💡 Posibles problemas:');
            console.log('1. La aplicación no está autorizada para la API');
            console.log('2. Las credenciales son incorrectas');
            console.log('3. La API no existe o tiene configuración incorrecta');
            
            return null;
        }
    }
}

async function testEndpointsWithToken(token) {
    if (!token) return;
    
    console.log('\n🧪 Probando endpoints con el token obtenido...');
    
    const endpoints = [
        'http://localhost:3000/health',
        'http://localhost:3000/api/test/public', 
        'http://localhost:3000/api/test/protected',
        'http://localhost:3000/api/auth/config'
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await axios.get(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log(`✅ ${endpoint} - Status: ${response.status}`);
            
        } catch (error) {
            if (error.response) {
                console.log(`❌ ${endpoint} - Status: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
            } else {
                console.log(`❌ ${endpoint} - Error: ${error.message}`);
            }
        }
    }
}

// Ejecutar pruebas
testWithCurrentScopes()
    .then(token => testEndpointsWithToken(token))
    .catch(console.error);
