const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../services/auth');
const logger = require('../utils/logger');

// GET /users - list all users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, name, email FROM users');
    res.json({ data: rows, count: rows.length });
  } catch (err) {
    logger.error('Failed to fetch users', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /users/:id - get user by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    logger.error('Failed to fetch user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// BUG: Missing authMiddleware on this route
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const { rows } = await db.query(
      'INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING *',
      [name, email, role]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    // BUG: Returning raw error message to client (information leak)
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// DELETE /users/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    logger.error('Failed to delete user', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
