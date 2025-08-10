const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /menu — categories + items
router.get('/', async (req, res) => {
  try {
    const cat = await db.query('SELECT * FROM menu_categories ORDER BY id');
    const items = await db.query('SELECT * FROM menu_items WHERE is_available=true ORDER BY id');
    res.json({ categories: cat.rows, items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
