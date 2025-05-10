const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
  });

  try {
    await client.connect();
    
    // Create database if it doesn't exist
    await client.query(`
      SELECT 'CREATE DATABASE lelesmart'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lelesmart')
    `);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
  }
}

setupDatabase(); 