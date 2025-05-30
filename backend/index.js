require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const { verifyToken, verifyAdmin } = require('./middlewares/auth'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'eaudeluxe'
});

// Middleware para inyectar conexión db en req
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Ruta para servir imágenes subidas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, unique);
  }
});
const upload = multer({ storage });

// Endpoint para subir imágenes
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se subió ninguna imagen' });
  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

// Rutas
app.use('/api/admin', verifyToken, verifyAdmin, require('./routes/admin'));
app.use('/api/reviews', verifyToken, require('./routes/reviews'));
app.use('/api/users', require('./routes/users')); // 🔐 El middleware se aplica por ruta cuando se necesita
app.use('/api/perfumes', require('./routes/perfumes'));
app.use('/api/cart', verifyToken, require('./routes/cart'));
app.use('/api/orders', verifyToken, require('./routes/orders'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/stripe', require('./routes/stripe-webhook'));
app.use('/uploads', express.static('uploads'));


// Ruta raíz para test
app.get('/', (req, res) => {
  res.send('API de la Tienda de Perfumes funcionando');
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado en http://localhost:${PORT}`);
});
