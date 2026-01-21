const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all trials
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM trials ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create trial
router.post('/', async (req, res) => {
    const { name, description, status, start_date, end_date } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO trials (name, description, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [name, description, status, start_date, end_date]
        );
        res.status(201).json({ id: result.insertId, name, description, status, start_date, end_date });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update trial
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, status, start_date, end_date } = req.body;
    try {
        await pool.query(
            'UPDATE trials SET name = ?, description = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?',
            [name, description, status, start_date, end_date, id]
        );
        res.json({ message: 'Trial updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete trial
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM trials WHERE id = ?', [id]);
        res.json({ message: 'Trial deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
