const express = require('express');
const router = express.Router();
const db = require('../db');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /orders — create order (returns razorpay order for client)
router.post('/', async (req, res) => {
  try {
    const { user_id, items, address, payment_method } = req.body;
    // calculate total
    let total = 0;
    for (const it of items) {
      const r = await db.query('SELECT price FROM menu_items WHERE id=$1', [it.id]);
      total += parseFloat(r.rows[0].price) * it.qty;
    }

    // create order in DB
    const orderRes = await db.query(
      'INSERT INTO orders(user_id, status, total_amount, payment_status, address) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [user_id || null, 'RECEIVED', total, 'PENDING', JSON.stringify(address)]
    );
    const order = orderRes.rows[0];

    if (payment_method === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(total * 100),
        currency: 'INR',
        receipt: `order_rcpt_${order.id}`,
      });
      // store razorpay_order_id
      await db.query('UPDATE orders SET razorpay_order_id=$1 WHERE id=$2', [razorpayOrder.id, order.id]);
      return res.json({ order, razorpayOrder });
    }

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// PATCH /orders/:id — update status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE orders SET status=$1 WHERE id=$2', [status, req.params.id]);
    // broadcast via socket (global)
    const io = req.app.get('io');
    if (io) io.emit(`orderStatus:${req.params.id}`, { status });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET order
router.get('/:id', async (req, res) => {
  const r = await db.query('SELECT * FROM orders WHERE id=$1', [req.params.id]);
  if (!r.rows.length) return res.status(404).json({ error: 'not found' });
  res.json(r.rows[0]);
});

module.exports = router;
