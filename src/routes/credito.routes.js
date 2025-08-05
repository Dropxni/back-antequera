// src/routes/credito.routes.js
const { Router } = require("express");

// Importaciones del controlador
const creditoController = require("../controllers/credito.controller");
const {
  registrarCredito,
  obtenerCreditoPorId,
  cancelarCredito
} = creditoController;

// Verificar si obtenerCreditosActivos existe, si no, crear una función temporal
const obtenerCreditosActivos = creditoController.obtenerCreditosActivos || 
  ((req, res) => res.status(501).json({ message: "Función no implementada" }));

// Importaciones de middlewares
const { verificarAutenticacion } = require("../middlewares/auth.middleware");

const validarCampos = require('../middlewares/validarCampos');
const router = Router();

// Crear nuevo crédito
router.post('/', 
  verificarAutenticacion,
    // Spread operator para el array de express-validator
  validarCampos,
  registrarCredito
);

// Obtener créditos activos de la sucursal
router.get(
  "/activos",
  verificarAutenticacion,
  obtenerCreditosActivos
);

// Obtener un crédito por ID (con historial de pagos)
router.get(
  "/:id",
  verificarAutenticacion,
  obtenerCreditoPorId
);

// Cancelar un crédito
router.put(
  "/cancelar/:id",
  verificarAutenticacion,
  cancelarCredito
);

module.exports = router;