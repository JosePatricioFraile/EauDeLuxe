const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const db = req.db;
  const { address_id, items, total_price } = req.body;
  const userId = req.user.id;

  const [result] = await db.query(
    'INSERT INTO orders (user_id, address_id, total_price) VALUES (?, ?, ?)',
    [userId, address_id, total_price]
  );
  const orderId = result.insertId;

  for (const item of items) {
    await db.query(
      'INSERT INTO order_items (order_id, perfume_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.perfume_id, item.quantity, item.price]
    );
  }

  await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  res.status(201).json({ message: 'Pedido creado correctamente' });
});

router.get('/', async (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const [rows] = await db.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  res.json(rows);
});

module.exports = router;
