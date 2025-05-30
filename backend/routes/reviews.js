const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');

// Añadir una reseña
router.post('/', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { rating, comment, perfume_id } = req.body;

  if (!rating || !comment || !perfume_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    await db.query(
      'INSERT INTO reviews (user_id, perfume_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
      [userId, perfume_id, rating, comment]
    );
    res.status(201).json({ message: 'Reseña añadida correctamente' });
  } catch (err) {
    console.error('Error al añadir reseña:', err);
    res.status(500).json({ message: 'Error al añadir reseña' });
  }
});

// Obtener reseñas de un perfume
router.get('/:perfumeId', async (req, res) => {
  const db = req.db;
  const perfumeId = req.params.perfumeId;

  try {
    const [rows] = await db.query(
      `SELECT r.id, r.user_id, r.comment, r.rating, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.perfume_id = ?
       ORDER BY r.created_at DESC`,
      [perfumeId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Error al obtener reseñas:', err);
    res.status(500).json({ message: 'Error al obtener reseñas' });
  }
});

module.exports = router;
