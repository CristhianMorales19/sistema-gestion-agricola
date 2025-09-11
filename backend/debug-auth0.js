const axios = require('axios');
require('dotenv').config();

async function debugAuth0() {
    console.log('🔍 Diagnóstico Auth0\n');

    const config = {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE
    };

    console.log('Configuración actual:');
    console.log(`Domain: ${config.domain}`);
    console.log(`Client ID: ${config.clientId}`);
    console.log(`Audience: ${config.audience}`);
    console.log(`Client Secret: ${config.clientSecret ? config.clientSecret.substring(0, 10) + '...' : 'NO CONFIGURADO'}\n`);

    // Prueba 1: Token sin audience
    console.log('🧪 Prueba 1: Obteniendo token sin audience específico...');
    try {
        const tokenResponse1 = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: 'client_credentials'
        });

        console.log('✅ Token obtenido sin audience!');
        console.log(`Scopes: ${tokenResponse1.data.scope || 'Ninguno'}`);
        console.log(`Token: ${tokenResponse1.data.access_token.substring(0, 50)}...\n`);

    } catch (error1) {
        console.log('❌ Error sin audience:');
        if (error1.response) {
            console.log(`Status: ${error1.response.status}`);
            console.log(`Error: ${JSON.stringify(error1.response.data)}`);
        }
        console.log('');
    }

    // Prueba 2: Token con audience
    console.log('🧪 Prueba 2: Obteniendo token con audience...');
    try {
        const tokenResponse2 = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            audience: config.audience,
            grant_type: 'client_credentials'
        });

        console.log('✅ Token obtenido con audience!');
        console.log(`Scopes: ${tokenResponse2.data.scope || 'Ninguno'}`);
        console.log(`Token: ${tokenResponse2.data.access_token.substring(0, 50)}...\n`);

        return tokenResponse2.data.access_token;

    } catch (error2) {
        console.log('❌ Error con audience:');
        if (error2.response) {
            console.log(`Status: ${error2.response.status}`);
            console.log(`Error: ${JSON.stringify(error2.response.data)}`);
        }
        console.log('');
        return null;
    }
}

debugAuth0().catch(console.error);
