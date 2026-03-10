import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const updateDatabase = async () => {
  try {
    await client.connect();
    const db = client.db('coaching_platform');

    // Drop the database
    await db.dropDatabase();
    console.log('Old database dropped successfully.');

    // Create new collections
    await db.createCollection('users');
    await db.createCollection('teams');
    await db.createCollection('events');
    await db.createCollection('players');
    await db.createCollection('activities');

    console.log('New collections created successfully.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await client.close();
  }
};

updateDatabase();