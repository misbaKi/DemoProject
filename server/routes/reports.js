const express = require('express');
const router = express.Router();
const pool = require('../db');

// Summary statistics
router.get('/summary', async (req, res) => {
    try {
        const [trialsCount] = await pool.query('SELECT COUNT(*) as count FROM trials');
        const [participantsCount] = await pool.query('SELECT COUNT(*) as count FROM participants');
        const [activitiesCount] = await pool.query('SELECT COUNT(*) as count FROM activities');

        const [statusStats] = await pool.query('SELECT status, COUNT(*) as count FROM trials GROUP BY status');

        res.json({
            summary: {
                trials: trialsCount[0].count,
                participants: participantsCount[0].count,
                activities: activitiesCount[0].count
            },
            statusStats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Participation report
router.get('/participation', async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT t.name as trial_name, COUNT(p.id) as participant_count
      FROM trials t
      LEFT JOIN participants p ON t.id = p.trial_id
      GROUP BY t.id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Full export data
router.get('/export', async (req, res) => {
    try {
        const [trials] = await pool.query('SELECT * FROM trials');
        const [participants] = await pool.query(`
            SELECT p.*, t.name as trial_name 
            FROM participants p
            JOIN trials t ON p.trial_id = t.id
        `);
        const [activities] = await pool.query(`
            SELECT a.*, p.participant_name, t.name as trial_name
            FROM activities a
            JOIN participants p ON a.participant_id = p.id
            JOIN trials t ON p.trial_id = t.id
        `);
        res.json({ trials, participants, activities });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
