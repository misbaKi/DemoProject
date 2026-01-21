const mysql = require('mysql2/promise');
require('dotenv').config();

async function reset() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
    });

    await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    console.log('Database dropped.');
    process.exit();
}

reset().catch(err => {
    console.error(err);
    process.exit(1);
});
