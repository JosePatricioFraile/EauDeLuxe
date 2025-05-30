const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { verifyToken } = require('../middlewares/auth');

router.post('/create-session', verifyToken, async (req, res) => {
  const db = req.db;
  const { items, address_id } = req.body;
  const userId = req.user.id;

  if (!address_id) {
    return res.status(400).json({ error: 'Dirección no proporcionada' });
  }

  // Validación de productos
  for (const item of items) {
    if (
      typeof item.name !== 'string' ||
      isNaN(Number(item.price)) ||
      isNaN(Number(item.quantity)) ||
      !item.size
    ) {
      console.error('❌ Producto inválido:', item);
      return res.status(400).json({ error: 'Datos de producto inválidos' });
    }
  }

  try {
    // Calcular total
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);

    // Crear pedido
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, address_id, total_price, status) VALUES (?, ?, ?, ?)',
      [userId, address_id, total, 'pendiente']
    );
    const orderId = orderResult.insertId;

    // Guardar los items
    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, perfume_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)',
        [
          orderId,
          item.perfume_id || item.id,
          Number(item.quantity),
          Number(item.price),
          item.size
        ]
      );
    }

    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    // Stripe line items
    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.name} (${item.size}ml)`
        },
        unit_amount: Math.round(Number(item.price) * 100)
      },
      quantity: Number(item.quantity)
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:4200/success',
      cancel_url: 'http://localhost:4200/cancel',
      metadata: {
        orderId: orderId.toString()
      }
    });

    res.json({ id: session.id });

  } catch (err) {
    console.error('❌ Error en checkout:', err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

module.exports = router;
