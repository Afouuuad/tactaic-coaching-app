const mongoose = require('mongoose');
const User = require('./models/user.model');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
      { name: 'Coach User', email: 'coach@example.com', password: hashedPassword, role: 'coach' },
      { name: 'Player User', email: 'player@example.com', password: hashedPassword, role: 'player' },
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
};

mongoose.connect('mongodb://localhost:27017/tactaiq', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected');
    seedUsers();
  })
  .catch(err => console.error('Database connection error:', err));