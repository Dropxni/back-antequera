const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursal.controller');
const { validarCrearSucursal, validarActualizarSucursal } = require('../validators/sucursal.validator');
const { verificarAutenticacion, soloAdministrador } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');

router.get('/', verificarAutenticacion, sucursalController.listar);

router.post(
  '/',
  verificarAutenticacion,
  soloAdministrador,
  validarCrearSucursal,
  validarCampos,
  sucursalController.crear
);

router.put(
  '/:id',
  verificarAutenticacion,
  soloAdministrador,
  validarActualizarSucursal,
  validarCampos,
  sucursalController.actualizar
);

router.delete(
  '/:id',
  verificarAutenticacion,
  soloAdministrador,
  sucursalController.eliminar
);

module.exports = router;
