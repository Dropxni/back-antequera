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
const categoriaRoutes = require('./src/routes/categoria.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const sucursalRoutes = require('./src/routes/sucursal.routes');
const ventaRoutes = require('./src/routes/venta.routes');
const corteCajaRoutes = require('./src/routes/corteCaja.routes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sucursales', sucursalRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/corte', corteCajaRoutes);

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
