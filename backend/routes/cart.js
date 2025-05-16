const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const [rows] = await db.query(
    'SELECT ci.*, p.name, p.price, p.image_url FROM cart_items ci JOIN perfumes p ON ci.perfume_id = p.id WHERE ci.user_id = ?',
    [userId]
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const db = req.db;
  const { perfume_id, quantity } = req.body;
  const userId = req.user.id;
  await db.query('INSERT INTO cart_items (user_id, perfume_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)',
    [userId, perfume_id, quantity]);
  res.status(201).json({ message: 'Producto añadido al carrito' });
});

router.delete('/:id', async (req, res) => {
  const db = req.db;
  await db.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);
  res.json({ message: 'Producto eliminado del carrito' });
});

module.exports = router;
