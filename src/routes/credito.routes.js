const express = require('express');
const router = express.Router();
const creditoController = require('../controllers/credito.controller');
const { verificarAutenticacion, soloCajero, administradorOCajero } = require('../middlewares/auth.middleware');
const { crearCreditoValidator, pagoCreditoValidator, validarIdCredito } = require('../validators/credito.validator');
const validarCampos = require('../middlewares/validarCampos');

// Créditos activos
router.get('/activos', verificarAutenticacion, creditoController.obtenerCreditosActivos);

// Créditos finalizados (historial)
router.get('/finalizados', verificarAutenticacion, creditoController.obtenerCreditosFinalizados);

// Detalle de un crédito con historial
router.get('/:id', verificarAutenticacion, validarIdCredito, validarCampos, creditoController.obtenerCreditoPorId);

// Crear crédito
router.post('/', verificarAutenticacion, soloCajero, crearCreditoValidator, validarCampos, creditoController.crearCredito);

// Registrar pago a un crédito
router.post('/pagos/:id', verificarAutenticacion, soloCajero, pagoCreditoValidator, validarCampos, creditoController.registrarPago);

// Cancelar crédito
router.put('/cancelar/:id', verificarAutenticacion, administradorOCajero, validarIdCredito, validarCampos, creditoController.cancelarCredito);

module.exports = router;