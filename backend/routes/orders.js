const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

// Crear un nuevo pedido
router.post('/', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { address_id, items, total_price } = req.body;

  if (!Array.isArray(items) || items.length === 0 || !address_id || !total_price) {
    return res.status(400).json({ message: 'Faltan datos del pedido' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO orders (user_id, address_id, total_price, status)
       VALUES (?, ?, ?, ?)`,
      [userId, address_id, total_price, 'pendiente']
    );

    const orderId = result.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, perfume_id, quantity, price, size)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.perfume_id || item.id,
          item.quantity,
          item.price,
          item.size
        ]
      );
    }

    res.status(201).json({ message: 'Pedido creado correctamente', orderId });
  } catch (err) {
    console.error('❌ Error al guardar el pedido:', err);
    res.status(500).json({ message: 'Error del servidor al guardar el pedido' });
  }
});

// Obtener pedidos del usuario
router.get('/', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  try {
    const [orders] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json(orders);
  } catch (err) {
    console.error('❌ Error al obtener pedidos:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener pedidos completos con detalles e imagen
router.get('/full', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, a.address, a.city, a.postal_code, a.country
       FROM orders o
       JOIN addresses a ON o.address_id = a.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN perfumes p ON oi.perfume_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error('❌ Error al obtener pedidos completos:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
