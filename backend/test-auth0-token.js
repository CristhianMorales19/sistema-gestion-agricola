const axios = require('axios');
require('dotenv').config();

async function testAuth0Token() {
    console.log('🔐 Probando obtención de token Auth0...\n');

    // Configuración desde variables de entorno
    const config = {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE
    };

    console.log('📋 Configuración:');
    console.log(`   Domain: ${config.domain}`);
    console.log(`   Client ID: ${config.clientId}`);
    console.log(`   Audience: ${config.audience}`);
    console.log(`   Client Secret: ${config.clientSecret ? '✅ Configurado' : '❌ No configurado'}\n`);

    try {
        console.log('🚀 Solicitando token de acceso...');
        
        const tokenResponse = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            audience: config.audience,
            grant_type: 'client_credentials'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Token obtenido exitosamente!');
        console.log(`   Token Type: ${tokenResponse.data.token_type}`);
        console.log(`   Expires In: ${tokenResponse.data.expires_in} segundos`);
        console.log(`   Scope: ${tokenResponse.data.scope || 'No scopes asignados'}`);
        console.log(`   Access Token: ${tokenResponse.data.access_token.substring(0, 50)}...\n`);

        // Probar endpoint protegido
        const accessToken = tokenResponse.data.access_token;
        
        console.log('🧪 Probando endpoint protegido...');
        
        try {
            const protectedResponse = await axios.get('http://localhost:3000/api/test/protected', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('✅ Endpoint protegido accesible!');
            console.log('   Respuesta:', JSON.stringify(protectedResponse.data, null, 2));
            
        } catch (protectedError) {
            console.log('❌ Error en endpoint protegido:');
            if (protectedError.response) {
                console.log(`   Status: ${protectedError.response.status}`);
                console.log(`   Error: ${JSON.stringify(protectedError.response.data, null, 2)}`);
            } else {
                console.log(`   Error: ${protectedError.message}`);
            }
        }

        // Probar endpoint con permisos específicos
        console.log('\n🔐 Probando endpoint con permisos...');
        
        try {
            const rbacResponse = await axios.get('http://localhost:3000/api/test/admin-only', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('✅ Endpoint con permisos accesible!');
            console.log('   Respuesta:', JSON.stringify(rbacResponse.data, null, 2));
            
        } catch (rbacError) {
            console.log('❌ Error en endpoint con permisos:');
            if (rbacError.response) {
                console.log(`   Status: ${rbacError.response.status}`);
                console.log(`   Error: ${JSON.stringify(rbacError.response.data, null, 2)}`);
            } else {
                console.log(`   Error: ${rbacError.message}`);
            }
        }

    } catch (error) {
        console.log('❌ Error obteniendo token:');
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
            
            if (error.response.status === 401) {
                console.log('\n💡 Posibles soluciones:');
                console.log('   1. Verificar que Client ID y Client Secret sean correctos');
                console.log('   2. Verificar que la aplicación esté autorizada para la API');
                console.log('   3. Verificar que el audience sea correcto');
            }
            
            if (error.response.status === 403) {
                console.log('\n💡 Posibles soluciones:');
                console.log('   1. Autorizar la aplicación Machine to Machine en Auth0 Dashboard');
                console.log('   2. Asignar scopes/permisos a la aplicación');
                console.log('   3. Verificar configuración de la API');
            }
        } else {
            console.log(`   Error: ${error.message}`);
        }
    }
}

// Función para decodificar JWT (solo para debugging)
function decodeJWT(token) {
    try {
        const parts = token.split('.');
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        console.log('\n🔍 Contenido del token:');
        console.log(JSON.stringify(payload, null, 2));
        return payload;
    } catch (error) {
        console.log('❌ Error decodificando token:', error.message);
        return null;
    }
}

// Ejecutar prueba
testAuth0Token().catch(console.error);
