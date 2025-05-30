const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

const SECRET = 'CLAVE_SECRETA_SEGURA';

// Registro
router.post('/register', async (req, res) => {
  const db = req.db;
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email ya está en uso' });
    }
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: users[0].role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Perfil del usuario autenticado
router.get('/me', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;

  try {
    const [[user]] = await db.query(
      'SELECT id, name, email FROM users WHERE id = ?',
      [userId]
    );

    const [[address]] = await db.query(
      'SELECT id, address, city, postal_code, country FROM addresses WHERE user_id = ? LIMIT 1',
      [userId]
    );

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      address: address || {}
    });
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
});

// Actualizar perfil
router.put('/me', verifyToken, async (req, res) => {
  const db = req.db;
  const userId = req.user.id;
  const { name, email, addressData } = req.body;

  try {
    await db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );

    const [existing] = await db.query(
      'SELECT id FROM addresses WHERE user_id = ?',
      [userId]
    );

    if (existing.length) {
      await db.query(
        `UPDATE addresses SET address = ?, city = ?, postal_code = ?, country = ?
         WHERE user_id = ?`,
        [
          addressData.address,
          addressData.city,
          addressData.postal_code,
          addressData.country,
          userId
        ]
      );
    } else {
      await db.query(
        `INSERT INTO addresses (user_id, address, city, postal_code, country)
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          addressData.address,
          addressData.city,
          addressData.postal_code,
          addressData.country
        ]
      );
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
