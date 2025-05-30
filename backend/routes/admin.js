const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Obtener todos los pedidos
router.get('/orders', verifyToken, verifyAdmin, async (req, res) => {
  const db = req.db;

  try {
    const [orders] = await db.query(
      'SELECT o.*, u.name AS user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC'
    );
    res.json(orders);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// Crear nuevo perfume
router.post('/perfumes', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  const db = req.db;
  const { name, brand, description, gender, stock, price50, price100 } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await db.query(
      'INSERT INTO perfumes (name, brand, description, gender, stock, price50, price100, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, brand, description, gender, stock, price50, price100, image_url]
    );
    res.status(201).json({ message: 'Perfume creado' });
  } catch (err) {
    console.error('Error al crear perfume:', err);
    res.status(500).json({ message: 'Error al crear perfume' });
  }
});

// Actualizar perfume
router.put('/perfumes/:id', verifyToken, verifyAdmin, upload.single('image'), async (req, res) => {
  const db = req.db;
  const { name, brand, description, gender, stock, price50, price100 } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const query = image_url
      ? 'UPDATE perfumes SET name = ?, brand = ?, description = ?, gender = ?, stock = ?, price50 = ?, price100 = ?, image_url = ? WHERE id = ?'
      : 'UPDATE perfumes SET name = ?, brand = ?, description = ?, gender = ?, stock = ?, price50 = ?, price100 = ? WHERE id = ?';

    const params = image_url
      ? [name, brand, description, gender, stock, price50, price100, image_url, req.params.id]
      : [name, brand, description, gender, stock, price50, price100, req.params.id];

    await db.query(query, params);
    res.json({ message: 'Perfume actualizado' });
  } catch (err) {
    console.error('Error al actualizar perfume:', err);
    res.status(500).json({ message: 'Error al actualizar perfume' });
  }
});

// Eliminar perfume
router.delete('/perfumes/:id', verifyToken, verifyAdmin, async (req, res) => {
  const db = req.db;

  try {
    await db.query('DELETE FROM perfumes WHERE id = ?', [req.params.id]);
    res.json({ message: 'Perfume eliminado' });
  } catch (err) {
    console.error('Error al eliminar perfume:', err);
    res.status(500).json({ message: 'Error al eliminar perfume' });
  }
});

module.exports = router;
