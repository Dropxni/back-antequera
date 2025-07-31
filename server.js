require('dotenv').config();
const express = require('express');
const path = require('path'); // Falta importar path
const app = express();
const cors = require('cors');

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const productosRoutes = require('./src/routes/producto.routes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);

// Ruta para servir imágenes estáticas
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Conexión con la base de datos
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });
