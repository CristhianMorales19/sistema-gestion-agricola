/**
 * Script para verificar si un usuario existe en Auth0
 * Uso: npx ts-node verificar-usuario-auth0.ts
 */

import { Auth0ManagementService } from './src/services/auth0-management.service';

async function verificarUsuario() {
  try {
    console.log('🔍 Verificando usuario en Auth0...\n');
    
    const auth0Service = new Auth0ManagementService();
    
    // Buscar por auth0_id
    const auth0Id = 'auth0|68df48dd89c0a4cbfea';
    console.log(`📌 Buscando usuario con ID: ${auth0Id}`);
    
    try {
      const usuario = await auth0Service.getUserById(auth0Id);
      console.log('\n✅ USUARIO ENCONTRADO EN AUTH0:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('User ID:', usuario.user_id);
      console.log('Email:', usuario.email);
      console.log('Name:', usuario.name);
      console.log('Email Verified:', usuario.email_verified);
      console.log('Created At:', usuario.created_at);
      console.log('Updated At:', usuario.updated_at);
      console.log('Logins Count:', usuario.logins_count);
      console.log('Last Login:', usuario.last_login);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('✅ El usuario SÍ existe en Auth0');
      
    } catch (error: any) {
      console.log('\n❌ USUARIO NO ENCONTRADO EN AUTH0');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Error:', error.message);
      console.log('Código:', error.statusCode);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      // Intentar buscar por email
      console.log('🔍 Intentando buscar por email: example@agromano.com');
      try {
        const usuarios = await auth0Service.getUsersByEmail('example@agromano.com');
        if (usuarios && usuarios.length > 0) {
          console.log('\n✅ ENCONTRADO POR EMAIL:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          usuarios.forEach((u: any) => {
            console.log('User ID:', u.user_id);
            console.log('Email:', u.email);
            console.log('Name:', u.name);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          });
        } else {
          console.log('❌ No se encontró por email tampoco');
        }
      } catch (emailError: any) {
        console.log('❌ Error buscando por email:', emailError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarUsuario();
