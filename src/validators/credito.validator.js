const { check } = require("express-validator");

const validarRegistroCredito = [
  check("nombre_cliente")
    .notEmpty()
    .withMessage("El nombre del cliente es obligatorio"),
  check("monto")
    .isFloat({ gt: 0 })
    .withMessage("El monto del crédito debe ser mayor a 0"),
  check("fecha_limite")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("La fecha límite debe tener un formato válido (YYYY-MM-DD)"),
  check("venta_id")
    .optional()
    .isInt()
    .withMessage("El ID de venta debe ser un número entero"),
  check("cliente_id")
    .optional()
    .isInt()
    .withMessage("El ID del cliente debe ser un número entero"),
];

module.exports = {
  validarRegistroCredito,
};
