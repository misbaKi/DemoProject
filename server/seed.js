const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('Seeding data...');

    const hashedPassword = await bcrypt.hash('root', 10);

    // Clean up
    await connection.query('DELETE FROM activities');
    await connection.query('DELETE FROM participants');
    await connection.query('DELETE FROM trials');
    await connection.query('DELETE FROM users WHERE username != "root"');

    // Admin user
    await connection.query('INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)', ['root', hashedPassword, 'admin']);

    // Create trials
    const trials = [
        ['Vaccine Phase 3', 'Testing efficacy in large population', 'active', '2025-01-01', '2026-01-01'],
        ['Heart Study A', 'Cardiovascular health monitoring', 'pending', '2025-06-01', '2027-06-01'],
        ['Eye Care Beta', 'New lens technology trial', 'completed', '2024-01-01', '2024-12-31']
    ];

    const trialIds = [];
    for (const t of trials) {
        const [result] = await connection.query('INSERT INTO trials (name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)', t);
        trialIds.push(result.insertId);
    }

    // Create participants
    const participantNames = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis'];
    for (let i = 0; i < participantNames.length; i++) {
        const name = participantNames[i];
        const trialId = trialIds[Math.floor(Math.random() * trialIds.length)];
        const [pResult] = await connection.query('INSERT INTO participants (participant_name, trial_id, enrollment_date, status) VALUES (?, ?, ?, ?)',
            [name, trialId, '2025-01-15', 'enrolled']);

        await connection.query('INSERT INTO activities (participant_id, activity_type, notes) VALUES (?, ?, ?)',
            [pResult.insertId, 'Initial Screening', 'Participant met all entry criteria.']);
    }

    console.log('Seed completed successfully.');
    process.exit();
}

seed().catch(err => {
    console.error('Error seeding data:', err);
    process.exit(1);
});
