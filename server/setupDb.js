const mysql = require('mysql2/promise');
require('dotenv').config();

async function setup() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  console.log('Connected to MySQL.');

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
  await connection.query(`USE ${process.env.DB_NAME}`);

  console.log(`Using database ${process.env.DB_NAME}.`);

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'investigator', 'participant') DEFAULT 'participant',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Trials table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS trials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('active', 'completed', 'pending') DEFAULT 'pending',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Participants table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      participant_name VARCHAR(255) NOT NULL,
      trial_id INT,
      enrollment_date DATE,
      status ENUM('enrolled', 'withdrawn', 'completed') DEFAULT 'enrolled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Activities table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      participant_id INT,
      activity_type VARCHAR(255),
      activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `);

  console.log('Tables created successfully.');
  process.exit();
}

setup().catch(err => {
  console.error('Error setting up database:', err);
  process.exit(1);
});
