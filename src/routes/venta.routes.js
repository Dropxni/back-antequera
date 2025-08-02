const express = require('express');
const router = express.Router();
const controller = require('../controllers/venta.controller');
const { verificarAutenticacion } = require('../middlewares/auth.middleware');
const validarCampos = require('../middlewares/validarCampos');
const {
  realizarVentaValidator,
  obtenerVentaPorIdValidator,
  rangoFechasValidator
} = require('../validators/venta.validator');

// Registrar una nueva venta
router.post(
  '/',
  verificarAutenticacion,
  realizarVentaValidator,
  validarCampos,
  controller.realizarVenta
);

// Obtener detalle de una venta
router.get(
  '/:id',
  verificarAutenticacion,
  obtenerVentaPorIdValidator,
  validarCampos,
  controller.obtenerVentaPorId
);

// Obtener ventas del día
router.get(
  '/',
  verificarAutenticacion,
  controller.obtenerVentasDelDia
);

// Obtener ventas por corte (para futura implementación de corte de caja)
router.get(
  '/por-corte/:corte_id',
  verificarAutenticacion,
  controller.obtenerVentasPorCorte
);

// (opcional) Eliminar venta
router.delete(
  '/:id',
  verificarAutenticacion,
  controller.eliminarVenta
);

router.get(
  '/rango',
  verificarAutenticacion,
  rangoFechasValidator,
  validarCampos,
  controller.obtenerVentasPorRangoFechas
);

router.get(
  '/resumen',
  verificarAutenticacion,
  rangoFechasValidator,
  validarCampos,
  controller.resumenVentas
);

module.exports = router;