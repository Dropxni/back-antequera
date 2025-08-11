const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');
const { verificarAutenticacion } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const { crearProductoValidator, actualizarProductoValidator } = require('../validators/producto.validator');

// Buscar producto por código de barras debe ir antes de /:id para evitar conflictos de rutas
router.get('/codigo/:codigo', verificarAutenticacion, controller.buscarPorCodigoBarras);

// Alertas de inventario
router.get('/alertas', verificarAutenticacion, controller.obtenerAlertasInventario);

// Obtener todos los productos de la sucursal
router.get('/', verificarAutenticacion, controller.obtenerProductos);

// Obtener producto por ID
router.get('/:id', verificarAutenticacion, controller.obtenerProductoPorId);

// Crear producto
router.post(
  '/',
  verificarAutenticacion,
  crearProductoValidator,
  validarCampos,
  controller.crearProducto
);

// Actualizar producto
router.put(
  '/:id',
  verificarAutenticacion,
  actualizarProductoValidator,
  validarCampos,
  controller.actualizarProducto
);

// Eliminar producto (desactivar)
router.delete('/:id', verificarAutenticacion, controller.eliminarProducto);

module.exports = router;