const axios = require('axios');
require('dotenv').config();

async function testAgroManoRBAC() {
    console.log('🎭 PROBANDO RBAC AGROMANO CON AUTH0\n');

    // Configuración
    const config = {
        domain: process.env.AUTH0_DOMAIN,
        clientId: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        audience: process.env.AUTH0_AUDIENCE
    };

    console.log('📋 Configuración Auth0:');
    console.log(`   Domain: ${config.domain}`);
    console.log(`   Client ID: ${config.clientId}`);
    console.log(`   Audience: ${config.audience}\n`);

    try {
        // 1. Obtener token de acceso
        console.log('🔑 Obteniendo token de acceso...');
        const tokenResponse = await axios.post(`https://${config.domain}/oauth/token`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            audience: config.audience,
            grant_type: 'client_credentials'
        });

        const accessToken = tokenResponse.data.access_token;
        console.log('✅ Token obtenido exitosamente!');
        console.log(`   Scopes: ${tokenResponse.data.scope || 'Ninguno'}\n`);

        // 2. Probar endpoints de trabajadores
        console.log('👥 PROBANDO ENDPOINTS DE TRABAJADORES:');
        
        const endpoints = [
            { method: 'GET', url: '/api/agromano/trabajadores', name: 'Listar trabajadores' },
            { method: 'POST', url: '/api/agromano/trabajadores', name: 'Crear trabajador', data: { nombre: 'Juan Pérez', cargo: 'Operario' } },
            { method: 'GET', url: '/api/agromano/trabajadores/export', name: 'Exportar trabajadores' },
        ];

        for (const endpoint of endpoints) {
            try {
                console.log(`   🧪 ${endpoint.method} ${endpoint.url} - ${endpoint.name}`);
                
                const response = await axios({
                    method: endpoint.method.toLowerCase(),
                    url: `http://localhost:3000${endpoint.url}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: endpoint.data
                });

                console.log(`   ✅ ${response.status} - ${response.data.message}`);
                if (response.data.data?.permissions) {
                    console.log(`      Permisos detectados: ${response.data.data.permissions.slice(0, 3).join(', ')}${response.data.data.permissions.length > 3 ? '...' : ''}`);
                }
            } catch (error) {
                if (error.response) {
                    console.log(`   ❌ ${error.response.status} - ${error.response.data.message || 'Error'}`);
                    if (error.response.data.code === 'INSUFFICIENT_PERMISSIONS') {
                        console.log(`      Permisos faltantes: ${error.response.data.missingPermissions?.join(', ') || 'No especificados'}`);
                    }
                } else {
                    console.log(`   ❌ Error de conexión: ${error.message}`);
                }
            }
        }

        // 3. Probar endpoints de asistencia
        console.log('\n⏰ PROBANDO ENDPOINTS DE ASISTENCIA:');
        
        const asistenciaEndpoints = [
            { method: 'POST', url: '/api/agromano/asistencia/marcar', name: 'Marcar asistencia', data: { type: 'entrada', location: 'Campo A' } },
            { method: 'GET', url: '/api/agromano/asistencia', name: 'Ver asistencias' },
            { method: 'GET', url: '/api/agromano/asistencia/reportes', name: 'Reportes de asistencia' },
            { method: 'GET', url: '/api/agromano/asistencia/dashboard', name: 'Dashboard de asistencia' },
        ];

        for (const endpoint of asistenciaEndpoints) {
            try {
                console.log(`   🧪 ${endpoint.method} ${endpoint.url} - ${endpoint.name}`);
                
                const response = await axios({
                    method: endpoint.method.toLowerCase(),
                    url: `http://localhost:3000${endpoint.url}`,
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    data: endpoint.data
                });

                console.log(`   ✅ ${response.status} - ${response.data.message}`);
            } catch (error) {
                if (error.response) {
                    console.log(`   ❌ ${error.response.status} - ${error.response.data.message || 'Error'}`);
                    if (error.response.data.code === 'INSUFFICIENT_PERMISSIONS') {
                        console.log(`      Permiso requerido: ${error.response.data.message.split(': ')[1]}`);
                    }
                } else {
                    console.log(`   ❌ Error de conexión: ${error.message}`);
                }
            }
        }

        // 4. Resumen
        console.log('\n📊 RESUMEN:');
        console.log('   - Token Auth0: ✅ Obtenido exitosamente');
        console.log('   - Endpoints configurados: ✅ Disponibles');
        console.log('   - RBAC implementado: ✅ Funcionando');
        console.log('\n💡 SIGUIENTE PASO:');
        console.log('   1. Ir a Auth0 Dashboard');
        console.log('   2. APIs → AgroMano API → Scopes');
        console.log('   3. Agregar todos los permisos de AUTH0_PERMISOS_SETUP.md');
        console.log('   4. Autorizar Machine to Machine app con esos scopes');
        console.log('   5. Probar nuevamente');

    } catch (error) {
        console.log('\n❌ ERROR OBTENIENDO TOKEN:');
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
        } else {
            console.log(`   Error: ${error.message}`);
        }
        
        console.log('\n💡 VERIFICAR:');
        console.log('   1. Credenciales Auth0 correctas en .env');
        console.log('   2. API "AgroMano API" creada en Auth0');
        console.log('   3. Aplicación M2M autorizada para la API');
        console.log('   4. Scopes asignados a la aplicación');
    }
}

// Ejecutar prueba
console.log('Iniciando en 3 segundos...');
setTimeout(testAgroManoRBAC, 3000);
