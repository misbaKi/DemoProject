const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all participants with trial info
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT p.*, t.name as trial_name 
      FROM participants p
      JOIN trials t ON p.trial_id = t.id
      ORDER BY p.created_at DESC
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll participant
router.post('/enroll', async (req, res) => {
    const { participant_name, trial_id, enrollment_date } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO participants (participant_name, trial_id, enrollment_date) VALUES (?, ?, ?)',
            [participant_name, trial_id, enrollment_date]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add activity
router.post('/activity', async (req, res) => {
    const { participant_id, activity_type, notes } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO activities (participant_id, activity_type, notes) VALUES (?, ?, ?)',
            [participant_id, activity_type, notes]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get activities for a participant
router.get('/:id/activities', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM activities WHERE participant_id = ? ORDER BY activity_date DESC', [id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update participant
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { participant_name, trial_id, enrollment_date, status } = req.body;
    try {
        await pool.query(
            'UPDATE participants SET participant_name = ?, trial_id = ?, enrollment_date = ?, status = ? WHERE id = ?',
            [participant_name, trial_id, enrollment_date, status, id]
        );
        res.json({ message: 'Participant profiling updated.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete participant
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Optional: Also delete activities for this participant if desired,
        // or let the database handle it if there were foreign keys (but we removed them for simplicity).
        await pool.query('DELETE FROM activities WHERE participant_id = ?', [id]);
        await pool.query('DELETE FROM participants WHERE id = ?', [id]);
        res.json({ message: 'Participant record and associated logs purged.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
