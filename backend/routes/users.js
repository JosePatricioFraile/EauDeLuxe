const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET = 'CLAVE_SECRETA_SEGURA';

// Registro de usuario
router.post('/register', async (req, res) => {
  const db = req.db;
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    // Intentar insertar (puede fallar por email duplicado)
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      // Email ya registrado
      return res.status(409).json({ message: 'Email already exists' });
    }

    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!users.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const valid = await bcrypt.compare(password, users[0].password);

    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: users[0].id, role: users[0].role },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: users[0].id,
        name: users[0].name,
        role: users[0].role
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
