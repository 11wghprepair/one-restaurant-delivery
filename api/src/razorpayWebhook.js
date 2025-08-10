const crypto = require('crypto');
const db = require('./db');

module.exports = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = req.body; // raw body required
    const expected = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');
    const actual = req.headers['x-razorpay-signature'];
    if (expected !== actual) return res.status(400).send('invalid signature');

    const payload = JSON.parse(body.toString());
    if (payload.event === 'payment.captured') {
      const rpPayment = payload.payload.payment.entity;
      // find order by razorpay_order_id
      const r = await db.query('SELECT * FROM orders WHERE razorpay_order_id=$1', [rpPayment.order_id]);
      if (r.rows.length) {
        const order = r.rows[0];
        await db.query('UPDATE orders SET payment_status=$1, status=$2 WHERE id=$3', ['PAID', 'PREPARING', order.id]);
      }
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'webhook error' });
  }
};
