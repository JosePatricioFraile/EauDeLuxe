const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const db = req.db;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Confirmación del pago
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const metadata = session.metadata;
    const items = JSON.parse(metadata.items);
    const userId = metadata.userId;
    const addressId = metadata.addressId;
    const total = session.amount_total / 100;

    try {
      // Crear pedido
      const [result] = await db.query(
        'INSERT INTO orders (user_id, address_id, total_price) VALUES (?, ?, ?)',
        [userId, addressId, total]
      );
      const orderId = result.insertId;

      // Guardar cada ítem
      for (const item of items) {
        await db.query(
          'INSERT INTO order_items (order_id, perfume_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.id, item.quantity, item.price]
        );
      }

      console.log('✅ Pedido guardado:', orderId);
    } catch (err) {
      console.error('Error guardando pedido:', err);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;
