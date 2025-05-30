const express = require('express');
const router = express.Router();

// Obtener todos o filtrados
router.get('/', async (req, res) => {
  const db = req.db;

  const q = req.query.q?.toLowerCase().trim();
  const gender = req.query.gender;
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);
  const noteId = req.query.note;
  const orderBy = req.query.orderBy;

  try {
    let sql = `
      SELECT DISTINCT p.*
      FROM perfumes p
      LEFT JOIN perfume_notes pn ON p.id = pn.perfume_id
      WHERE 1 = 1
    `;
    const params = [];

    if (q) {
      sql += ` AND (LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ?)`;
      const like = `%${q}%`;
      params.push(like, like);
    }

    if (gender) {
      sql += ` AND p.gender = ?`;
      params.push(gender);
    }

    if (!isNaN(minPrice)) {
      sql += ` AND p.price100 >= ?`;
      params.push(minPrice);
    }

    if (!isNaN(maxPrice)) {
      sql += ` AND p.price100 <= ?`;
      params.push(maxPrice);
    }

    if (noteId) {
      sql += ` AND pn.note_id = ?`;
      params.push(noteId);
    }

    if (orderBy) {
      const orderMap = {
        'price100_asc': 'p.price100 ASC',
        'price100_desc': 'p.price100 DESC',
        'name_asc': 'p.name ASC',
        'name_desc': 'p.name DESC'
      };
      const orderSql = orderMap[orderBy];
      if (orderSql) sql += ` ORDER BY ${orderSql}`;
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error al filtrar perfumes:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Obtener un perfume por ID (DETALLE)
router.get('/:id', async (req, res) => {
  const db = req.db;
  const perfumeId = req.params.id;

  try {
    const [perfumeRows] = await db.query(
      'SELECT * FROM perfumes WHERE id = ?',
      [perfumeId]
    );

    if (!perfumeRows.length) {
      return res.status(404).json({ message: 'Perfume no encontrado' });
    }

    const perfume = perfumeRows[0];

    const [notes] = await db.query(
      `SELECT n.id, n.name
       FROM notes n
       JOIN perfume_notes pn ON n.id = pn.note_id
       WHERE pn.perfume_id = ?`,
      [perfumeId]
    );

    const [reviews] = await db.query(
      `SELECT r.id, r.user_id, r.comment, r.rating, r.created_at, u.name as user_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.perfume_id = ?`,
      [perfumeId]
    );

    perfume.notes = notes;
    perfume.reviews = reviews;

    res.json(perfume);
  } catch (err) {
    console.error('Error al obtener perfume:', err);
    res.status(500).json({ message: 'Error al obtener perfume' });
  }
});

module.exports = router;
