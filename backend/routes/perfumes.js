const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.db;
  const [rows] = await db.query('SELECT * FROM perfumes');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const db = req.db;
  const perfumeId = req.params.id;

  try {
    // Obtener perfume
    const [rows] = await db.query('SELECT * FROM perfumes WHERE id = ?', [perfumeId]);
    if (!rows.length) return res.status(404).json({ message: 'Perfume no encontrado' });

    const perfume = rows[0];

    // Obtener notas olfativas
    const [notes] = await db.query(
      `SELECT n.id, n.name 
       FROM notes n
       JOIN perfume_notes pn ON n.id = pn.note_id
       WHERE pn.perfume_id = ?`,
      [perfumeId]
    );

    perfume.notes = notes;

    // Obtener reseñas
    const [reviews] = await db.query(
      'SELECT r.id, r.user_id, r.comment, r.rating, r.created_at, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.perfume_id = ?',
      [perfumeId]
    );
    perfume.reviews = reviews;
    
    res.json(perfume);
  } catch (err) {
    console.error('Error al obtener perfume:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
