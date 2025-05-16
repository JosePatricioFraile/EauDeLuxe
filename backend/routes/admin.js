const express = require('express');
const router = express.Router();

router.get('/orders', async (req, res) => {
  const db = req.db;
  const [orders] = await db.query(
    'SELECT o.*, u.name AS user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
  );
  res.json(orders);
});

router.post('/perfumes', async (req, res) => {
  const db = req.db;
  const { name, brand, description, price, gender, image_url, stock } = req.body;
  await db.query(
    'INSERT INTO perfumes (name, brand, description, price, gender, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, brand, description, price, gender, image_url, stock]
  );
  res.status(201).json({ message: 'Perfume creado' });
});

router.delete('/perfumes/:id', async (req, res) => {
  const db = req.db;
  await db.query('DELETE FROM perfumes WHERE id = ?', [req.params.id]);
  res.json({ message: 'Perfume eliminado' });
});

module.exports = router;
