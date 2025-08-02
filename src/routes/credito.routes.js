const { Router } = require("express");
const { verificarAutenticacion } = require("../middlewares/auth.middleware");
const {
  crearCreditoValidator,
  obtenerCreditoPorIdValidator,
} = require("../validators/credito.validator");

const creditoController = require("../controllers/credito.controller");

const router = Router();

// Crear crédito para una venta (versión simplificada para debug)
router.post(
  "/",
  verificarAutenticacion,
  creditoController.registrarCredito
);

// Obtener todos los créditos pendientes por sucursal
router.get("/", verificarAutenticacion, creditoController.obtenerCreditosActivos);

// Obtener detalle de un crédito por ID
router.get(
  "/:id",
  verificarAutenticacion,
  creditoController.obtenerCreditoPorId
);

// Cancelar un crédito
router.put(
  "/:id/cancelar",
  verificarAutenticacion,
  creditoController.cancelarCredito
);

module.exports = router;