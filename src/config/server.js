const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const productoRoutes = require('./routes/productos.routes');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/productos', productoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
