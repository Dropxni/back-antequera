const creditoService = require('../services/credito.service');
const { validationResult } = require('express-validator');

// Registrar un nuevo crédito
const registrarCredito = async (req, res) => {
  try {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const cajeroId = req.usuario.id; // Asumiendo que tienes el usuario autenticado
    const sucursalId = req.usuario.sucursal_id;

    const nuevoCredito = await creditoService.registrarCredito(req.body, cajeroId, sucursalId);

    res.status(201).json({
      mensaje: 'Crédito registrado correctamente',
      credito: nuevoCredito,
    });
  } catch (error) {
    console.error('Error al registrar el crédito:', error);
    res.status(500).json({
      mensaje: 'Error al registrar el crédito',
      error: error.message,
    });
  }
};

// Obtener todos los créditos activos por sucursal
const obtenerCreditos = async (req, res) => {
  try {
    const sucursalId = req.usuario.sucursal_id;
    const creditos = await creditoService.obtenerCreditosPorSucursal(sucursalId);

    res.json({ creditos });
  } catch (error) {
    console.error('Error al obtener créditos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener créditos',
      error: error.message,
    });
  }
};

// Obtener un crédito con su historial de pagos
const obtenerCreditoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const credito = await creditoService.obtenerCreditoConPagos(id);
    res.json({ credito });
  } catch (error) {
    console.error('Error al obtener crédito:', error);
    res.status(404).json({
      mensaje: 'Crédito no encontrado',
      error: error.message,
    });
  }
};

// Cancelar un crédito
const cancelarCredito = async (req, res) => {
  try {
    const { id } = req.params;
    const creditoCancelado = await creditoService.cancelarCredito(id);

    res.json({
      mensaje: 'Crédito cancelado correctamente',
      credito: creditoCancelado,
    });
  } catch (error) {
    console.error('Error al cancelar crédito:', error);
    res.status(400).json({
      mensaje: 'No se pudo cancelar el crédito',
      error: error.message,
    });
  }
};

module.exports = {
  registrarCredito,
  obtenerCreditos,
  obtenerCreditoPorId,
  cancelarCredito,
};
