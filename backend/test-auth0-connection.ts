import { ManagementClient } from 'auth0';
import dotenv from 'dotenv';

dotenv.config();

async function testAuth0Connection() {
  console.log('🔍 Testing Auth0 Connection...');
  console.log('📋 Configuration:');
  console.log(`   Domain: ${process.env.AUTH0_DOMAIN}`);
  console.log(`   Client ID: ${process.env.AUTH0_CLIENT_ID}`);
  console.log(`   Client Secret: ${process.env.AUTH0_CLIENT_SECRET ? '***' + process.env.AUTH0_CLIENT_SECRET.slice(-4) : 'Not set'}`);
  console.log(`   Audience: ${process.env.AUTH0_AUDIENCE}`);

  try {
    const management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN!,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!
    });

    console.log('\n🔄 Testing Management API access...');

    // Test 1: Get roles
    console.log('1️⃣ Getting roles...');
    const rolesResponse = await management.roles.getAll() as any;
    const rolesData = rolesResponse.data || rolesResponse || [];
    console.log(`   ✅ Success! Found ${rolesData.length} roles`);
    rolesData.forEach((role: any, index: number) => {
      console.log(`      ${index + 1}. ${role.name} (${role.id})`);
    });

    // Test 2: Get users (limited)
    console.log('\n2️⃣ Getting users...');
    const usersResponse = await management.users.getAll({ per_page: 5 }) as any;
    const usersData = usersResponse.data || usersResponse || [];
    console.log(`   ✅ Success! Found users (showing first 5)`);
    
    usersData.forEach((user: any, index: number) => {
      console.log(`      ${index + 1}. ${user.email || user.user_id}`);
    });

    console.log('\n✅ Auth0 connection test successful!');

  } catch (error) {
    console.error('\n❌ Auth0 connection test failed:');
    console.error('Error details:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      if ('response' in error) {
        console.error('Response status:', (error as any).response?.status);
        console.error('Response data:', (error as any).response?.data);
      }
    }
  }
}

testAuth0Connection();