const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../services/auth');
const logger = require('../utils/logger');

// GET /orders - list orders for authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ data: rows, count: rows.length });
  } catch (err) {
    logger.error('Failed to fetch orders', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /orders/:id - get order by id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    logger.error('Failed to fetch order', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /orders - create a new order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shipping_address } = req.body;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { rows } = await db.query(
      'INSERT INTO orders (user_id, items, total, shipping_address, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, JSON.stringify(items), total, shipping_address, 'pending']
    );
    logger.info(`Order created: ${rows[0].id}`);
    res.status(201).json({ data: rows[0] });
  } catch (err) {
    logger.error('Failed to create order', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
