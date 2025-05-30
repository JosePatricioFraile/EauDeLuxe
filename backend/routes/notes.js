const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.db;

  try {
    const [rows] = await db.query('SELECT id, name FROM notes ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener notas:', err);
    res.status(500).json({ message: 'Error al obtener las notas' });
  }
});

module.exports = router;
