const router = require('express').Router();
const controller = require('../controllers/corteCaja.controller');
const { verificarAutenticacion } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const { abrirCorteValidator } = require('../validators/corteCaja.validator');

router.post(
  '/abrir',
  verificarAutenticacion,
  abrirCorteValidator,
  validarCampos,
  controller.abrirCorte
);

router.post(
  '/cerrar',
  verificarAutenticacion,
  controller.cerrarCorte
);

router.get(
  '/actual',
  verificarAutenticacion,
  controller.obtenerCorteActual
);

module.exports = router;