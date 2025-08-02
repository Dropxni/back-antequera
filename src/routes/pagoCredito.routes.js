const { Router } = require("express");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const { validarCampos } = require("../middlewares/validarCampos");
const {
  registrarPagoValidator,
  creditoIdValidator,
} = require("../validators/pagoCredito.validator");

const {
  registrarPago,
  obtenerPagos,
} = require("../controllers/pagoCredito.controller");

const router = Router();

// Registrar un pago para un crédito (versión simplificada primero)
router.post(
  "/:creditoId",
  verificarAutenticacion,
  registrarPago
);

// Obtener pagos realizados para un crédito
router.get(
  "/:creditoId",
  verificarAutenticacion,
  obtenerPagos
);

module.exports = router;