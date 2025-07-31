const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const { verificarAutenticacion, soloAdministrador } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const {
  registrarUsuarioValidator,
  actualizarUsuarioValidator
} = require('../validators/usuario.validator');

// Solo admins pueden gestionar usuarios
router.get('/', verificarAutenticacion, soloAdministrador, controller.obtenerUsuarios);

router.post(
  '/',
  verificarAutenticacion,
  soloAdministrador,
  registrarUsuarioValidator,
  validarCampos,
  controller.registrarUsuario
);

router.put(
  '/:id',
  verificarAutenticacion,
  soloAdministrador,
  actualizarUsuarioValidator,
  validarCampos,
  controller.actualizarUsuario
);

router.delete('/:id', verificarAutenticacion, soloAdministrador, controller.eliminarUsuario);

module.exports = router;
