const creditoService = require('../services/credito.service');

exports.obtenerCreditosActivos = async (req, res) => {
  const creditos = await creditoService.listarCreditosActivos(req.usuario.sucursal_id);
  res.json({ creditos });
};

exports.obtenerCreditosFinalizados = async (req, res) => {
  const creditos = await creditoService.listarCreditosFinalizados(req.usuario.sucursal_id);
  res.json({ creditos });
};

exports.obtenerCreditoPorId = async (req, res) => {
  const credito = await creditoService.obtenerCreditoConPagos(req.params.id);
  res.json({ credito });
};

exports.crearCredito = async (req, res) => {
  const nuevo = await creditoService.crearCredito({
    ...req.body,
    cajero_id: req.usuario.id,
    sucursal_id: req.usuario.sucursal_id
  });
  res.status(201).json({ credito: nuevo });
};

exports.registrarPago = async (req, res) => {
  const pago = await creditoService.registrarPago(req.params.id, {
    ...req.body,
    cajero_id: req.usuario.id
  });
  res.status(201).json({ pago });
};

exports.cancelarCredito = async (req, res) => {
  const credito = await creditoService.cancelarCredito(req.params.id);
  res.json({ credito });
};