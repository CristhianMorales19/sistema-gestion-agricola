// Script de Verificación de Configuración Auth0
// Ejecutar en la consola del navegador

console.log('🔍 Verificando configuración de Auth0...\n');

// Verificar variables de entorno
console.log('📋 Variables de entorno del Frontend:');
console.log('- AUTH0_DOMAIN:', process.env.REACT_APP_AUTH0_DOMAIN || 'NO DEFINIDA');
console.log('- AUTH0_CLIENT_ID:', process.env.REACT_APP_AUTH0_CLIENT_ID || 'NO DEFINIDA');
console.log('- AUTH0_AUDIENCE:', process.env.REACT_APP_AUTH0_AUDIENCE || 'NO DEFINIDA');
console.log('- API_URL:', process.env.REACT_APP_API_URL || 'NO DEFINIDA');

console.log('\n🌐 URLs de callback esperadas por Auth0:');
console.log('- Frontend dev:', window?.location?.origin || 'http://localhost:3000');
console.log('- Callback URL:', `${window?.location?.origin || 'http://localhost:3000'}/callback`);

console.log('\n⚠️  REVISA EN AUTH0 DASHBOARD:');
console.log('1. Applications → agromano-frontend-app → Settings');
console.log('2. Allowed Callback URLs debe incluir:');
console.log('   - http://localhost:3000');
console.log('   - http://localhost:3000/callback');
console.log('3. Allowed Web Origins debe incluir:');
console.log('   - http://localhost:3000');

console.log('\n🔧 Si persiste el error:');
console.log('1. Ir a Auth0 Dashboard → Logs');
console.log('2. Ver detalles del error específico');
console.log('3. Verificar que la Application Type sea "Single Page Application"');

// Test de conectividad
console.log('\n🧪 Testing conectividad...');
fetch('http://localhost:3001/api/health')
  .then(response => {
    if (response.ok) {
      console.log('✅ Backend responde correctamente');
    } else {
      console.log('❌ Backend no responde:', response.status);
    }
  })
  .catch(error => {
    console.log('❌ Error conectando al backend:', error.message);
  });
