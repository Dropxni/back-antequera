const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoria.controller');
const { verificarAutenticacion } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const {
  crearCategoriaValidator,
  actualizarCategoriaValidator
} = require('../validators/categoria.validator');

router.get('/', verificarAutenticacion, controller.obtenerCategorias);

router.post(
  '/',
  verificarAutenticacion,
  crearCategoriaValidator,
  validarCampos,
  controller.crearCategoria
);

router.put(
  '/:id',
  verificarAutenticacion,
  actualizarCategoriaValidator,
  validarCampos,
  controller.actualizarCategoria
);

router.delete('/:id', verificarAutenticacion, controller.eliminarCategoria);

module.exports = router;
