require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flowfleet');
    
    // Clear existing users to prevent duplicates if run multiple times
    await User.deleteMany({});

    const users = [
      { name: 'System Admin', email: 'admin@flowfleet.com', password: 'password123', role: 'Admin' },
      { name: 'Lead Dispatcher', email: 'dispatcher@flowfleet.com', password: 'password123', role: 'Dispatcher' },
      { name: 'John Driver', email: 'driver@flowfleet.com', password: 'password123', role: 'Driver' },
      { name: 'Acme Corp', email: 'client@flowfleet.com', password: 'password123', role: 'Client' },
    ];

    for (let u of users) {
      await User.create(u);
    }

    console.log('✅ Demo users seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
