const { validationResult } = require("express-validator");
const PagoCreditoService = require("../services/pagoCredito.service");

const registrarPago = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    // Mapear los campos del body a los que espera el servicio
    const dataPago = {
      monto: req.body.monto_pagado,
      fecha: req.body.fecha_pago,
      observaciones: req.body.observaciones
    };

    const pago = await PagoCreditoService.registrarPago(
      req.params.creditoId, // Usar creditoId (consistente con la ruta)
      dataPago,
      req.usuario.id
    );
    
    res.status(201).json(pago);
  } catch (error) {
    console.error("Error al registrar el pago:", error);
    res.status(500).json({ 
      mensaje: "Error al registrar el pago", 
      error: error.message 
    });
  }
};

const obtenerPagos = async (req, res) => { // Cambiar nombre para que coincida con las rutas
  try {
    const pagos = await PagoCreditoService.obtenerPagosPorCredito(
      req.params.creditoId // Usar creditoId (consistente con la ruta)
    );
    res.json(pagos);
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener los pagos", 
      error: error.message 
    });
  }
};

module.exports = {
  registrarPago,
  obtenerPagos, // Exportar con el nombre correcto
};