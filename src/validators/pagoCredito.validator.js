const { body, param } = require("express-validator");

const creditoIdValidator = [
  param("creditoId")
    .notEmpty().withMessage("El ID del crédito es obligatorio")
    .isInt({ min: 1 }).withMessage("El ID debe ser un número válido"),
];

const registrarPagoValidator = [
  body("monto_pagado")
    .notEmpty().withMessage("Debe proporcionar el monto pagado")
    .isFloat({ min: 1 }).withMessage("El monto debe ser mayor a cero"),

  body("fecha_pago")
    .notEmpty().withMessage("Debe proporcionar la fecha de pago")
    .isISO8601().withMessage("Formato de fecha inválido (ISO8601 esperado)"),

  body("observaciones")
    .optional()
    .isString().withMessage("Las observaciones deben ser texto"),
];

console.log('registrarPagoValidator[0] es función:', typeof registrarPagoValidator[0]);

module.exports = {
  creditoIdValidator,
  registrarPagoValidator,
};