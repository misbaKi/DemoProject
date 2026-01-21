const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function cleanSetup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    console.log('Dropping existing database...');
    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);

    console.log('Creating fresh database...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create Tables (Empty)
    console.log('Creating tables...');

    await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'investigator', 'participant') DEFAULT 'participant',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await connection.query(`
    CREATE TABLE trials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('active', 'completed', 'pending') DEFAULT 'pending',
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await connection.query(`
    CREATE TABLE participants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      participant_name VARCHAR(255) NOT NULL,
      trial_id INT,
      enrollment_date DATE,
      status ENUM('enrolled', 'withdrawn', 'completed') DEFAULT 'enrolled',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    await connection.query(`
    CREATE TABLE activities (
      id INT AUTO_INCREMENT PRIMARY KEY,
      participant_id INT,
      activity_type VARCHAR(255),
      activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    )
  `);

    // Create only the ADMIN user (required to login)
    console.log('Adding admin user...');
    const hashedPassword = await bcrypt.hash('root', 10);
    await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['root', hashedPassword, 'admin']);

    console.log('Clean setup completed. No mock data added.');
    process.exit();
}

cleanSetup().catch(err => {
    console.error('Error during clean setup:', err);
    process.exit(1);
});
