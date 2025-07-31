const express = require('express');
const router = express.Router();
const controller = require('../controllers/producto.controller');
const { verificarAutenticacion } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const { crearProductoValidator, actualizarProductoValidator } = require('../validators/producto.validator');

router.get('/', verificarAutenticacion, controller.obtenerProductos);
router.get('/:id', verificarAutenticacion, controller.obtenerProductoPorId);

// Alertas
router.get('/alertas', verificarAutenticacion, controller.obtenerAlertasInventario);

router.post(
  '/',
  verificarAutenticacion,
  crearProductoValidator,
  validarCampos,
  controller.crearProducto
);

router.put(
  '/:id',
  verificarAutenticacion,
  actualizarProductoValidator,
  validarCampos,
  controller.actualizarProducto
);

router.delete('/:id', verificarAutenticacion, controller.eliminarProducto);


module.exports = router;