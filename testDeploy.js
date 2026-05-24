const baseURL = 'https://flowfleet.onrender.com/api';

async function testDeployment() {
  console.log('Testing Deployment at', baseURL);
  
  try {
    // 1. Test basic login endpoint (should return 401/404/200 depending on credentials, but not 502/network error)
    console.log('Testing /auth/login...');
    const res = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@flowfleet.com', password: 'password123' })
    });
    
    if (res.ok) {
      console.log('✅ Auth Endpoint is UP and working!');
    } else {
      console.log(`⚠️ Auth Endpoint returned ${res.status}: ${await res.text()}`);
    }

    // 2. Test root endpoint if exists, else just rely on the auth test
  } catch (err) {
    console.error('❌ Deployment Test Failed:', err.message);
  }
}

testDeployment();
