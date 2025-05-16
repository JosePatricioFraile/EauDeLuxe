const express = require('express');
const router = express.Router();

router.post('/:perfumeId', async (req, res) => {
  const db = req.db;
  const { rating, comment } = req.body;
  const perfumeId = req.params.perfumeId;
  const userId = req.user.id;
  await db.query('INSERT INTO reviews (user_id, perfume_id, rating, comment) VALUES (?, ?, ?, ?)',
    [userId, perfumeId, rating, comment]);
  res.status(201).json({ message: 'Reseña añadida' });
});

router.get('/:perfumeId', async (req, res) => {
  const db = req.db;
  const perfumeId = req.params.perfumeId;
  const [rows] = await db.query(
    'SELECT r.*, u.name FROM reviews r JOIN users u ON r.user_id = u.id WHERE perfume_id = ? ORDER BY created_at DESC',
    [perfumeId]
  );
  res.json(rows);
});

module.exports = router;
