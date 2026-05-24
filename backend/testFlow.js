process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const baseURL = 'https://localhost:5000/api';

async function apiCall(method, path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error: ${err}`);
  }
  return res.json();
}

async function runTestFlow() {
  try {
    console.log('--- Starting Test Data Generation ---');
    
    // 1. Login as Admin
    console.log('Logging in as Admin...');
    let res = await apiCall('POST', '/auth/login', { email: 'admin@flowfleet.com', password: 'password123' });
    const adminToken = res.token;

    // 2. Add Trucks
    console.log('Adding Trucks...');
    await apiCall('POST', '/trucks', { registrationNumber: 'MH-12-AB-1111', capacity: 10, fuelEfficiency: 12 }, adminToken).catch(() => {});
    await apiCall('POST', '/trucks', { registrationNumber: 'MH-14-CD-2222', capacity: 20, fuelEfficiency: 8 }, adminToken).catch(() => {});
    const trucks = await apiCall('GET', '/trucks', null, adminToken);
    console.log(`Available Trucks: ${trucks.length}`);

    // 3. Login as Client
    console.log('Logging in as Client...');
    res = await apiCall('POST', '/auth/login', { email: 'client@flowfleet.com', password: 'password123' });
    const clientToken = res.token;

    // 4. Create Delivery Requests
    console.log('Creating Delivery Requests...');
    const req1 = await apiCall('POST', '/shipments/request', {
      origin: { address: 'Mumbai Factory', lat: 19.07, lng: 72.87 },
      destination: { address: 'Pune Warehouse', lat: 18.52, lng: 73.85 },
      weight: 8.5
    }, clientToken);
    
    const req2 = await apiCall('POST', '/shipments/request', {
      origin: { address: 'Delhi Hub', lat: 28.61, lng: 77.20 },
      destination: { address: 'Jaipur Store', lat: 26.91, lng: 75.78 },
      weight: 15
    }, clientToken);

    console.log(`Created 2 Requests.`);

    // 5. Login as Dispatcher
    console.log('Logging in as Dispatcher...');
    res = await apiCall('POST', '/auth/login', { email: 'dispatcher@flowfleet.com', password: 'password123' });
    const dispatcherToken = res.token;

    // 6. Review Requests
    console.log('Approving Requests...');
    const approvalRes1 = await apiCall('PUT', `/shipments/request/${req1._id}/review`, { status: 'Approved', priority: 'High' }, dispatcherToken);
    const shipment1Id = approvalRes1.shipment._id;

    const approvalRes2 = await apiCall('PUT', `/shipments/request/${req2._id}/review`, { status: 'Approved', priority: 'Medium' }, dispatcherToken);
    const shipment2Id = approvalRes2.shipment._id;

    // 7. Get Driver
    console.log('Logging in as Driver to get ID...');
    res = await apiCall('POST', '/auth/login', { email: 'driver@flowfleet.com', password: 'password123' });
    const driverId = res._id;
    const driverToken = res.token;

    // 8. Assign Trucks to Shipments
    console.log('Assigning Trucks to Shipments...');
    if (trucks.length >= 2) {
      await apiCall('POST', `/shipments/${shipment1Id}/assign`, { truckId: trucks[0]._id, driverId: driverId }, dispatcherToken);
      await apiCall('POST', `/shipments/${shipment2Id}/assign`, { truckId: trucks[1]._id, driverId: driverId }, dispatcherToken);
    }

    // 9. Driver Updates Status
    console.log('Driver updating Shipment 1 status to In Transit...');
    await apiCall('PUT', `/shipments/${shipment1Id}/status`, { status: 'In Transit' }, driverToken);

    // Update Truck 1 Location
    console.log('Updating Truck 1 Location...');
    await apiCall('PUT', `/trucks/${trucks[0]._id}/location`, { lat: 18.7, lng: 73.2 }, driverToken);

    console.log('✅ Test flow completed successfully! Real data is now in the database.');

  } catch (err) {
    console.error('❌ Error in test flow:', err.message);
  }
}

runTestFlow();
