// Script de prueba para Auth0
// Ejecutar con: node test-auth0-setup.js

const axios = require('axios');

const AUTH0_DOMAIN = 'dev-agromano.us.auth0.com';
const CLIENT_ID = 'YOUR_CLIENT_ID_HERE'; // Reemplazar con tu Client ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE'; // Reemplazar con tu Client Secret
const AUDIENCE = 'https://agromano-api.com';

async function testAuth0Setup() {
  console.log('🔧 Probando configuración Auth0...\n');
  
  try {
    // 1. Probar obtener token de management API
    console.log('1. Obteniendo token de Management API...');
    const tokenResponse = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials'
    });
    
    console.log('✅ Token obtenido exitosamente');
    
    // 2. Probar conexión a Management API
    const token = tokenResponse.data.access_token;
    console.log('\n2. Probando conexión a Management API...');
    
    const usersResponse = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Conexión exitosa a Management API');
    console.log(`📊 Usuarios encontrados: ${usersResponse.data.length}`);
    
    // 3. Verificar configuración de API
    console.log('\n3. Verificando configuración de Resource Server...');
    const apiResponse = await axios.get(`https://${AUTH0_DOMAIN}/api/v2/resource-servers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const agroManoApi = apiResponse.data.find(api => api.identifier === AUDIENCE);
    if (agroManoApi) {
      console.log('✅ API AgroMano encontrada');
      console.log(`📋 Scopes configurados: ${agroManoApi.scopes?.length || 0}`);
    } else {
      console.log('⚠️  API AgroMano no encontrada - necesitas crearla');
    }
    
    console.log('\n🎉 ¡Configuración Auth0 parece estar funcionando!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Crear la API en Auth0 Dashboard si no existe');
    console.log('   2. Configurar roles y permisos');
    console.log('   3. Actualizar CLIENT_ID y CLIENT_SECRET en .env');
    console.log('   4. Probar endpoints protegidos');
    
  } catch (error) {
    console.error('❌ Error en configuración Auth0:', error.response?.data || error.message);
    console.log('\n🔧 Verifica:');
    console.log('   - CLIENT_ID y CLIENT_SECRET son correctos');
    console.log('   - El dominio Auth0 es correcto');
    console.log('   - La aplicación está configurada como Machine to Machine');
  }
}

// Ejecutar prueba
testAuth0Setup();
